import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { answers } from "@/lib/db/schema";
import {
  updateAnswerSchema,
  answerParamsSchema,
} from "@/lib/validations/answer";
import { eq } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = answerParamsSchema.parse(await params);

    const [answer] = await db
      .select()
      .from(answers)
      .where(eq(answers.id, id))
      .limit(1);

    if (!answer) {
      return handleApiError("answer not found");
    }

    return NextResponse.json({
      success: true,
      data: answer,
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
    const { id } = answerParamsSchema.parse(await params);
    const body = await request.json();
    const validatedData = updateAnswerSchema.parse(body);

    // Check if answer exists
    const [existingAnswer] = await db
      .select()
      .from(answers)
      .where(eq(answers.id, id))
      .limit(1);

    if (!existingAnswer) {
      return handleApiError("answer not found");
    }

    // Update answer
    const [updatedAnswer] = await db
      .update(answers)
      .set(validatedData)
      .where(eq(answers.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedAnswer,
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
    const { id } = answerParamsSchema.parse(await params);

    // Check if answer exists
    const [existingAnswer] = await db
      .select()
      .from(answers)
      .where(eq(answers.id, id))
      .limit(1);

    if (!existingAnswer) {
      return handleApiError("answer not found");
    }

    // Delete answer
    await db.delete(answers).where(eq(answers.id, id));

    return NextResponse.json({
      success: true,
      data: {
        message: "Answer deleted successfully",
        deletedAnswer: existingAnswer,
      },
    });
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}