import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { questionOptions } from "@/lib/db/schema";
import {
  updateQuestionOptionSchema,
  questionOptionParamsSchema,
} from "@/lib/validations/question-option";
import { eq } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = questionOptionParamsSchema.parse(params);

    const [option] = await db
      .select()
      .from(questionOptions)
      .where(eq(questionOptions.id, id))
      .limit(1);

    if (!option) {
      return handleApiError("question option not found");
    }

    return NextResponse.json({
      success: true,
      data: option,
    });
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = questionOptionParamsSchema.parse(params);
    const body = await request.json();
    const validatedData = updateQuestionOptionSchema.parse(body);

    // Check if option exists
    const [existingOption] = await db
      .select()
      .from(questionOptions)
      .where(eq(questionOptions.id, id))
      .limit(1);

    if (!existingOption) {
      return handleApiError("question option not found");
    }

    // Update option
    const [updatedOption] = await db
      .update(questionOptions)
      .set(validatedData)
      .where(eq(questionOptions.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedOption,
    });
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = questionOptionParamsSchema.parse(params);

    // Check if option exists
    const [existingOption] = await db
      .select()
      .from(questionOptions)
      .where(eq(questionOptions.id, id))
      .limit(1);

    if (!existingOption) {
      return handleApiError("question option not found");
    }

    // Delete option
    await db.delete(questionOptions).where(eq(questionOptions.id, id));

    return NextResponse.json({
      success: true,
      data: {
        message: "Question option deleted successfully",
        deletedOption: existingOption,
      },
    });
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}