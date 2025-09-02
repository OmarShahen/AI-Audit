import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { companies, submissions, answers, questionCategories } from "@/lib/db/schema";
import {
  createSubmissionSchema,
  submissionQuerySchema,
} from "@/lib/validations/submission";
import { eq, and, asc, desc } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedQuery = submissionQuerySchema.parse(queryParams);

    const { page, limit, formId, companyId, sortOrder } = validatedQuery;

    const offset = (page - 1) * limit;

    const whereConditions = [];

    if (formId) {
      whereConditions.push(eq(submissions.formId, formId));
    }

    if (companyId) {
      whereConditions.push(eq(submissions.companyId, companyId));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const orderByClause =
      sortOrder === "asc"
        ? asc(submissions.createdAt)
        : desc(submissions.createdAt);

    const [submissionsList, totalCountResult] = await Promise.all([
      db
        .select()
        .from(submissions)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),

      db
        .select({ count: submissions.id })
        .from(submissions)
        .where(whereClause),
    ]);

    const totalCount = totalCountResult.length;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        submissions: submissionsList,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}

// Enhanced schema for complete form submission
const completeSubmissionSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  formData: z.record(z.union([z.string(), z.array(z.string())])),
  email: z.string().email("Valid email is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if it's a complete form submission or basic submission
    if (body.companyName && body.formData && body.email) {
      return handleCompleteFormSubmission(body);
    } else {
      // Handle basic submission (backward compatibility)
      const validatedData = createSubmissionSchema.parse(body);
      const [newSubmission] = await db
        .insert(submissions)
        .values(validatedData)
        .returning();

      return NextResponse.json(
        {
          success: true,
          data: newSubmission,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}

async function handleCompleteFormSubmission(body: any) {
  const validatedData = completeSubmissionSchema.parse(body);

  // Start transaction to create submission and answers
  const result = await db.transaction(async (tx) => {
    // Get company data
    const company = await tx.query.companies.findFirst({
      where: eq(companies.name, validatedData.companyName),
    });

    if (!company) {
      throw new Error("Company not found");
    }

    // Create submission
    const [newSubmission] = await tx
      .insert(submissions)
      .values({
        formId: company.formId,
        companyId: company.id,
      })
      .returning();

    // Get all questions for this company's form to validate answers
    const formCategories = await tx.query.questionCategories.findMany({
      where: eq(questionCategories.formId, company.formId),
      with: {
        questions: true,
      },
    });

    // Flatten all questions from all categories
    const allQuestions = formCategories.flatMap(cat => cat.questions);

    // Create answers for each form field
    const answersToInsert = [];
    for (const [fieldKey, value] of Object.entries(validatedData.formData)) {
      // Extract question ID from field key (format: "question_123")
      const questionIdMatch = fieldKey.match(/^question_(\d+)$/);
      if (questionIdMatch) {
        const questionId = parseInt(questionIdMatch[1]);
        
        // Verify question exists for this form
        const question = allQuestions.find(q => q.id === questionId);
        if (question) {
          // Convert value to string for storage
          const answerValue = Array.isArray(value) ? JSON.stringify(value) : String(value);
          
          answersToInsert.push({
            submissionId: newSubmission.id,
            questionId: questionId,
            value: answerValue,
          });
        }
      }
    }

    // Insert all answers
    if (answersToInsert.length > 0) {
      await tx.insert(answers).values(answersToInsert);
    }

    // Return submission with basic info
    return {
      submissionId: newSubmission.id,
      companyId: company.id,
      companyName: company.name,
      formId: company.formId,
      answersCount: answersToInsert.length,
      createdAt: newSubmission.createdAt,
      email: validatedData.email,
    };
  });

  return NextResponse.json({
    success: true,
    message: "Form submission saved successfully",
    data: result,
  });
}