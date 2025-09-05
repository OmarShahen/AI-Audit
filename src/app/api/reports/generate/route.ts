import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { submissions, answers, questions, companies } from "@/lib/db/schema";
import { generateReportSchema } from "@/lib/validations/report";
import { handleApiError } from "@/lib/errors/error-handler";
import { eq, sql } from "drizzle-orm";
import { generateReport } from "@/lib/services/generate-report";
import { getClientReportPrompt } from "@/lib/prompts/client-report-prompt";
import { getInternalAgencyPrompt } from "@/lib/prompts/internal-agency-prompt";
import { sendReportEmail } from "@/lib/services/email-report";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = generateReportSchema.parse(body);

    const [submission] = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, validatedData.submissionId))
      .limit(1);
    if (!submission) {
      throw new Error("Submission not found");
    }

    const submissionAnswers = await db
      .select({
        question: questions.text,
        answer: sql`array_agg(${answers.value})`,
      })
      .from(answers)
      .where(eq(answers.submissionId, validatedData.submissionId))
      .leftJoin(questions, eq(questions.id, answers.questionId))
      .groupBy(questions.text);

    const formattedAnswer = submissionAnswers.map((item: any) => ({
      question: item.question,
      answer: item.answer.join(", "),
    }));

    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, submission.companyId!))
      .limit(1);

    if (!company) {
      throw new Error("Company not found for this form submission");
    }

    const CLIENT_PROMPT = getClientReportPrompt({
      name: company.name,
      industry: company.industry,
      currentDate: new Date(),
    });

    const INTERNAL_AGENCY_PROMPT = getInternalAgencyPrompt({
      companyName: company.name,
      industry: company.industry,
      size: company.size,
      currentDate: new Date(),
    });

    // Generate both reports in parallel
    const [report, internalReport] = await Promise.all([
      generateReport({
        instructions: CLIENT_PROMPT,
        userAnswers: formattedAnswer,
      }),
      generateReport({
        instructions: INTERNAL_AGENCY_PROMPT,
        userAnswers: formattedAnswer,
      }),
    ]);

    // Send emails in parallel
    const agencyEmail = process.env.AGENCY_EMAIL!;
    const emailPromises = [
      // Send to user
      sendReportEmail({
        email: validatedData.email,
        reportText: report,
        subject: `${company.name} Technology & Workflow Opportunity Report`,
        attachmentName: `${company.name}-audit-report`,
        format: "markdown",
      }),
      // Send internal agency report
      sendReportEmail({
        email: agencyEmail,
        reportText: internalReport,
        subject: `Internal Agency Report - ${company.name} Audit Submission`,
        attachmentName: `${company.name}-internal-agency-report`,
        format: "markdown",
      }),
    ];

    // Send to provider email if exists
    if (company.providerEmail) {
      emailPromises.push(
        sendReportEmail({
          email: company.providerEmail,
          reportText: report,
          subject: `${company.name} Technology & Workflow Opportunity Report`,
          attachmentName: `${company.name}-audit-report`,
          format: "markdown",
        })
      );
    }

    const [emailResult, agencyEmailResult, providerEmailResult] =
      await Promise.all(emailPromises);

    if (!emailResult.success) {
      throw new Error("There was a problem sending your email");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Report generated and sent successfully!",
        emailData: emailResult.data,
        agencyReportMail: agencyEmailResult,
        providerReportMail: providerEmailResult || null,
        report,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}
