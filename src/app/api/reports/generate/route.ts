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
import { sendAgencyEmail } from "@/lib/services/email-agency";

export async function POST(request: NextRequest) {
  try {
    console.log('in begining report')
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

    const [client] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, submission.companyId!))
      .limit(1);

      if (!client) {
      throw new Error("Client not found for this form submission");
    }

      const [partner] = await db.select().from(companies).where(eq(companies.id, client.partnerId!)).limit(1)

      if(!partner) {
        throw new Error('Partner not found for this form submission')
      }

    const CLIENT_PROMPT = getClientReportPrompt({
      name: client.name,
      industry: client.industry,
      currentDate: new Date(),
    });

    const INTERNAL_AGENCY_PROMPT = getInternalAgencyPrompt({
      companyName: client.name,
      industry: client.industry,
      size: client.size,
      currentDate: new Date(),
    });

    // Generate both reports in parallel
    const [report, internalReport] = await Promise.all([
      generateReport({
        instructions: CLIENT_PROMPT,
        userAnswers: formattedAnswer,
        model: validatedData.model,
      }),
      generateReport({
        instructions: INTERNAL_AGENCY_PROMPT,
        userAnswers: formattedAnswer,
        model: validatedData.model,
      }),
    ]);

    // Send client and partner emails in parallel
    const [clientEmailResult, partnerEmailResult] = await Promise.all([
      // Send to client's report to the client
      sendReportEmail({
        email: client.contactEmail,
        reportText: report,
        subject: `${client.name} Technology & Workflow Opportunity Report`,
        attachmentName: `${client.name}-audit-report`,
        format: "markdown",
      }),
      // Send to client's report to the partner
      sendReportEmail({
        email: partner.contactEmail,
        reportText: report,
        subject: `${client.name} Technology & Workflow Opportunity Report`,
        attachmentName: `${client.name}-audit-report`,
        format: "markdown",
      }),
    ]);

    // Send agency email separately to avoid rate limiting
    const agencyEmail = process.env.AGENCY_EMAIL!;
    const agencyEmailResult = await sendAgencyEmail({
      email: agencyEmail,
      clientReport: report,
      internalReport: internalReport,
      submissionId: validatedData.submissionId,
    });

    if (!clientEmailResult.success) {
      throw new Error("There was a problem sending your email");
    }

    console.log('at the  end of report')
    return NextResponse.json(
      {
        success: true,
        message: "Report generated and sent successfully!",
        clientEmail: clientEmailResult,
        partnerEmail: partnerEmailResult,
        agencyEmail: agencyEmailResult,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}
