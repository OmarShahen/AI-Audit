import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { questions } from "@/lib/db/schema";
import {
  createQuestionSchema,
  questionQuerySchema,
} from "@/lib/validations/question";
import { eq, ilike, and, asc, desc } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedQuery = questionQuerySchema.parse(queryParams);

    const { page, limit, categoryId, type, required, search, sortBy, sortOrder } = validatedQuery;

    const offset = (page - 1) * limit;

    let whereConditions = [];

    if (categoryId) {
      whereConditions.push(eq(questions.categoryId, categoryId));
    }

    if (type) {
      whereConditions.push(eq(questions.type, type));
    }

    if (required !== undefined) {
      whereConditions.push(eq(questions.required, required));
    }

    if (search) {
      whereConditions.push(ilike(questions.text, `%${search}%`));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const orderByClause =
      sortOrder === "asc"
        ? asc(questions.createdAt)
        : desc(questions.createdAt);

    const [questionsList, totalCountResult] = await Promise.all([
      db
        .select()
        .from(questions)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),

      db
        .select({ count: questions.id })
        .from(questions)
        .where(whereClause),
    ]);

    const totalCount = totalCountResult.length;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        questions: questionsList,
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
    const validatedData = createQuestionSchema.parse(body);

    const [newQuestion] = await db
      .insert(questions)
      .values(validatedData)
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: newQuestion,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}