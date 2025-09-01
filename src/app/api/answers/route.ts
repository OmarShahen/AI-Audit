import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { answers } from "@/lib/db/schema";
import {
  createAnswerSchema,
  answerQuerySchema,
} from "@/lib/validations/answer";
import { eq, ilike, and, asc, desc } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedQuery = answerQuerySchema.parse(queryParams);

    const { page, limit, submissionId, questionId, search, sortOrder } = validatedQuery;

    const offset = (page - 1) * limit;

    const whereConditions = [];

    if (submissionId) {
      whereConditions.push(eq(answers.submissionId, submissionId));
    }

    if (questionId) {
      whereConditions.push(eq(answers.questionId, questionId));
    }

    if (search) {
      whereConditions.push(ilike(answers.value, `%${search}%`));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const orderByClause =
      sortOrder === "asc"
        ? asc(answers.createdAt)
        : desc(answers.createdAt);

    const [answersList, totalCountResult] = await Promise.all([
      db
        .select()
        .from(answers)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),

      db
        .select({ count: answers.id })
        .from(answers)
        .where(whereClause),
    ]);

    const totalCount = totalCountResult.length;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        answers: answersList,
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
    const validatedData = createAnswerSchema.parse(body);

    const [newAnswer] = await db
      .insert(answers)
      .values(validatedData)
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: newAnswer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}