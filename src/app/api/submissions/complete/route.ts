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

    const [company, form] = await Promise.all([
      db.query.companies.findFirst({
      where: eq(companies.id, validatedData.companyId),
    }),
    db.query.forms.findFirst({
      where: eq(forms.id, validatedData.formId),
    })
    ])

    if (!company) {
      throw new Error("Company not found");
    }

    if (!form) {
      throw new Error("Form not found");
    }

    // Start transaction to create submission and answers
    const result = await db.transaction(async (tx) => {

      // Validate and process form data using validation function
      const { validatedAnswers } = await validateAndProcessFormData(
        validatedData.formData,
        validatedData.formId
      );

      if (!validatedAnswers.length) {
        throw new Error("No valid question found");
      }

      const newSubmissionData = {
        formId: validatedData.formId,
        companyId: validatedData.companyId,
      };
      const [newSubmission] = await tx
        .insert(submissions)
        .values(newSubmissionData)
        .returning();

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
    return handleApiError(error);
  }
}
