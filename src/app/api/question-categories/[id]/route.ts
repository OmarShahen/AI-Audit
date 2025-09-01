import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { questionCategories } from "@/lib/db/schema";
import {
  updateQuestionCategorySchema,
  questionCategoryParamsSchema,
} from "@/lib/validations/question-category";
import { eq } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = questionCategoryParamsSchema.parse(await params);

    const [category] = await db
      .select()
      .from(questionCategories)
      .where(eq(questionCategories.id, id))
      .limit(1);

    if (!category) {
      return handleApiError("question category not found");
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = questionCategoryParamsSchema.parse(await params);
    const body = await request.json();
    const validatedData = updateQuestionCategorySchema.parse(body);

    // Check if category exists
    const [existingCategory] = await db
      .select()
      .from(questionCategories)
      .where(eq(questionCategories.id, id))
      .limit(1);

    if (!existingCategory) {
      return handleApiError("question category not found");
    }

    // Update category
    const [updatedCategory] = await db
      .update(questionCategories)
      .set(validatedData)
      .where(eq(questionCategories.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = questionCategoryParamsSchema.parse(await params);

    // Check if category exists
    const [existingCategory] = await db
      .select()
      .from(questionCategories)
      .where(eq(questionCategories.id, id))
      .limit(1);

    if (!existingCategory) {
      return handleApiError("question category not found");
    }

    // Delete category
    await db.delete(questionCategories).where(eq(questionCategories.id, id));

    return NextResponse.json({
      success: true,
      data: {
        message: "Question category deleted successfully",
        deletedCategory: existingCategory,
      },
    });
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}