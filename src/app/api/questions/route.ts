import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { questionCategories, questions } from "@/lib/db/schema";
import {
  createQuestionSchema,
  questionQuerySchema,
  updateQuestionSchema,
} from "@/lib/validations/question";
import { eq, ilike, and, asc, desc } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedQuery = questionQuerySchema.parse(queryParams);

    const { page, limit, categoryId, type, required, search, sortOrder } =
      validatedQuery;

    const offset = (page - 1) * limit;

    const whereConditions = [];

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

    // Get questions (options and conditionals are now embedded as JSON)
    const [questionsList, totalCountResult] = await Promise.all([
      db
        .select()
        .from(questions)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),

      db.select({ count: questions.id }).from(questions).where(whereClause),
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
        questions: questionsList,
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

    const questionCategory = await db.query.questionCategories.findFirst({
      where: eq(questionCategories.id, validatedData.categoryId),
    });

    if (!questionCategory) {
      throw new Error("Question category not found");
    }

    // Create the question with embedded options and conditionals
    const [newQuestion] = await db
      .insert(questions)
      .values({
        categoryId: validatedData.categoryId,
        text: validatedData.text,
        type: validatedData.type,
        required: validatedData.required,
        order: validatedData.order,
        options: validatedData.options,
        conditionals: validatedData.conditionals,
      })
      .returning();

    const result = newQuestion;

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('id');
    
    if (!questionId) {
      return NextResponse.json(
        { success: false, message: 'Question ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateQuestionSchema.parse(body);

    // Check if question exists
    const existingQuestion = await db.query.questions.findFirst({
      where: eq(questions.id, parseInt(questionId)),
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { success: false, message: 'Question not found' },
        { status: 404 }
      );
    }

    // Update the question with embedded options and conditionals
    const updateData: Record<string, any> = {};
    if (validatedData.text !== undefined) updateData.text = validatedData.text;
    if (validatedData.type !== undefined) updateData.type = validatedData.type;
    if (validatedData.required !== undefined) updateData.required = validatedData.required;
    if (validatedData.order !== undefined) updateData.order = validatedData.order;
    if (validatedData.options !== undefined) updateData.options = validatedData.options;
    if (validatedData.conditionals !== undefined) updateData.conditionals = validatedData.conditionals;

    const [updatedQuestion] = await db
      .update(questions)
      .set(updateData)
      .where(eq(questions.id, parseInt(questionId)))
      .returning();

    const result = updatedQuestion;

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}
