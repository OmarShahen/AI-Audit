import { db } from "@/lib/db";
import { answers, companies, forms, submissions } from "@/lib/db/schema";
import { handleApiError } from "@/lib/errors/error-handler";
import {
  completeSubmissionSchema,
  validateAndProcessFormData,
} from "@/lib/validations/submission";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate input data using Zod schema
    const validatedData = completeSubmissionSchema.parse(body);

    const company = await db.query.companies.findFirst({
      where: eq(companies.name, validatedData.companyName),
    });

    if (!company) {
      throw new Error("Company not found");
    }

    // Start transaction to create submission and answers
    const result = await db.transaction(async (tx) => {
      const newSubmissionData = {
        formId: company.formId,
        companyId: company.id,
      };
      const [newSubmission] = await tx
        .insert(submissions)
        .values(newSubmissionData)
        .returning();

      // Validate and process form data using validation function
      const { validatedAnswers } = await validateAndProcessFormData(
        validatedData.formData,
        company.formId
      );

      if (!validatedAnswers.length) {
        throw new Error("No valid question found");
      }

      const answersToInsert = validatedAnswers.map((answer) => ({
        submissionId: newSubmission.id,
        questionId: answer.questionId,
        value: answer.value,
      }));

      const insertedAnswers = await tx
        .insert(answers)
        .values(answersToInsert)
        .returning();

      // Return comprehensive submission info
      return {
        submission: newSubmission,
        answers: insertedAnswers,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Form submission saved successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}
