import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forms, questionCategories } from "@/lib/db/schema";
import {
  createQuestionCategorySchema,
  questionCategoryQuerySchema,
} from "@/lib/validations/question-category";
import { eq, ilike, and, asc, desc } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedQuery = questionCategoryQuerySchema.parse(queryParams);

    const { page, limit, formId, search, sortOrder } = validatedQuery;

    const offset = (page - 1) * limit;

    const whereConditions = [];

    if (formId) {
      whereConditions.push(eq(questionCategories.formId, formId));
    }

    if (search) {
      whereConditions.push(ilike(questionCategories.name, `%${search}%`));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const orderByClause =
      sortOrder === "asc"
        ? asc(questionCategories.createdAt)
        : desc(questionCategories.createdAt);

    const [categoriesList, totalCountResult] = await Promise.all([
      db
        .select()
        .from(questionCategories)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),

      db
        .select({ count: questionCategories.id })
        .from(questionCategories)
        .where(whereClause),
    ]);

    const totalCount = totalCountResult.length;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        questionCategories: categoriesList,
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
    const validatedData = createQuestionCategorySchema.parse(body);

    const form = await db.query.forms.findFirst({
      where: eq(forms.id, validatedData.formId),
    });

    if (!form) {
      throw new Error("Form not found");
    }

    const [newCategory] = await db
      .insert(questionCategories)
      .values(validatedData)
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}
