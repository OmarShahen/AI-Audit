import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { questionConditionals } from "@/lib/db/schema";
import {
  updateQuestionConditionalSchema,
  questionConditionalParamsSchema,
} from "@/lib/validations/question-conditional";
import { eq } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = questionConditionalParamsSchema.parse(await params);

    const [conditional] = await db
      .select()
      .from(questionConditionals)
      .where(eq(questionConditionals.id, id))
      .limit(1);

    if (!conditional) {
      return handleApiError("question conditional not found");
    }

    return NextResponse.json({
      success: true,
      data: conditional,
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
    const { id } = questionConditionalParamsSchema.parse(await params);
    const body = await request.json();
    const validatedData = updateQuestionConditionalSchema.parse(body);

    // Check if conditional exists
    const [existingConditional] = await db
      .select()
      .from(questionConditionals)
      .where(eq(questionConditionals.id, id))
      .limit(1);

    if (!existingConditional) {
      return handleApiError("question conditional not found");
    }

    // Update conditional
    const [updatedConditional] = await db
      .update(questionConditionals)
      .set(validatedData)
      .where(eq(questionConditionals.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedConditional,
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
    const { id } = questionConditionalParamsSchema.parse(await params);

    // Check if conditional exists
    const [existingConditional] = await db
      .select()
      .from(questionConditionals)
      .where(eq(questionConditionals.id, id))
      .limit(1);

    if (!existingConditional) {
      return handleApiError("question conditional not found");
    }

    // Delete conditional
    await db.delete(questionConditionals).where(eq(questionConditionals.id, id));

    return NextResponse.json({
      success: true,
      data: {
        message: "Question conditional deleted successfully",
        deletedConditional: existingConditional,
      },
    });
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}