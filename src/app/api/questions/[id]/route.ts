import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { questions } from "@/lib/db/schema";
import {
  updateQuestionSchema,
  questionParamsSchema,
} from "@/lib/validations/question";
import { eq } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = questionParamsSchema.parse(await params);

    const [question] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, id))
      .limit(1);

    if (!question) {
      return handleApiError("question not found");
    }

    return NextResponse.json({
      success: true,
      data: question,
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
    const { id } = questionParamsSchema.parse(await params);
    const body = await request.json();
    const validatedData = updateQuestionSchema.parse(body);

    // Check if question exists
    const [existingQuestion] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, id))
      .limit(1);

    if (!existingQuestion) {
      return handleApiError("question not found");
    }

    // Update question
    const [updatedQuestion] = await db
      .update(questions)
      .set(validatedData)
      .where(eq(questions.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedQuestion,
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
    const { id } = questionParamsSchema.parse(await params);

    // Check if question exists
    const [existingQuestion] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, id))
      .limit(1);

    if (!existingQuestion) {
      return handleApiError("question not found");
    }

    // Delete question
    await db.delete(questions).where(eq(questions.id, id));

    return NextResponse.json({
      success: true,
      data: {
        message: "Question deleted successfully",
        deletedQuestion: existingQuestion,
      },
    });
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}