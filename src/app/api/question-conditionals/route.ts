import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { questionConditionals } from "@/lib/db/schema";
import {
  createQuestionConditionalSchema,
  questionConditionalQuerySchema,
} from "@/lib/validations/question-conditional";
import { eq, and, asc, desc } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedQuery = questionConditionalQuerySchema.parse(queryParams);

    const {
      page,
      limit,
      questionId,
      conditionQuestionId,
      showQuestion,
      sortBy,
      sortOrder,
    } = validatedQuery;

    const offset = (page - 1) * limit;

    let whereConditions = [];

    if (questionId) {
      whereConditions.push(eq(questionConditionals.questionId, questionId));
    }

    if (conditionQuestionId) {
      whereConditions.push(
        eq(questionConditionals.conditionQuestionId, conditionQuestionId)
      );
    }

    if (showQuestion !== undefined) {
      whereConditions.push(eq(questionConditionals.showQuestion, showQuestion));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const orderByClause =
      sortOrder === "asc"
        ? asc(questionConditionals.createdAt)
        : desc(questionConditionals.createdAt);

    const [conditionalsList, totalCountResult] = await Promise.all([
      db
        .select()
        .from(questionConditionals)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),

      db
        .select({ count: questionConditionals.id })
        .from(questionConditionals)
        .where(whereClause),
    ]);

    const totalCount = totalCountResult.length;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        questionConditionals: conditionalsList,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createQuestionConditionalSchema.parse(body);

    const [newConditional] = await db
      .insert(questionConditionals)
      .values(validatedData)
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: newConditional,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}
