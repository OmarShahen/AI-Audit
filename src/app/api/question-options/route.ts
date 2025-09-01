import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { questionOptions } from "@/lib/db/schema";
import {
  createQuestionOptionSchema,
  questionOptionQuerySchema,
} from "@/lib/validations/question-option";
import { eq, ilike, and, asc, desc } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedQuery = questionOptionQuerySchema.parse(queryParams);

    const { page, limit, questionId, search, sortBy, sortOrder } =
      validatedQuery;

    const offset = (page - 1) * limit;

    let whereConditions = [];

    if (questionId) {
      whereConditions.push(eq(questionOptions.questionId, questionId));
    }

    if (search) {
      whereConditions.push(ilike(questionOptions.text, `%${search}%`));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const orderByClause =
      sortOrder === "asc"
        ? asc(questionOptions.createdAt)
        : desc(questionOptions.createdAt);

    const [optionsList, totalCountResult] = await Promise.all([
      db
        .select()
        .from(questionOptions)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),

      db
        .select({ count: questionOptions.id })
        .from(questionOptions)
        .where(whereClause),
    ]);

    const totalCount = totalCountResult.length;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        questionOptions: optionsList,
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
    const validatedData = createQuestionOptionSchema.parse(body);

    const [newOption] = await db
      .insert(questionOptions)
      .values(validatedData)
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: newOption,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}
