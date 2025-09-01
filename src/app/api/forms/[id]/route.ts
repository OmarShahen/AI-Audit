import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forms } from "@/lib/db/schema";
import { updateFormSchema, formParamsSchema } from "@/lib/validations/form";
import { eq } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = formParamsSchema.parse(params);

    const [form] = await db
      .select()
      .from(forms)
      .where(eq(forms.id, id))
      .limit(1);

    if (!form) {
      throw new Error("Form not found");
    }

    return NextResponse.json({
      success: true,
      data: form,
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
    const { id } = formParamsSchema.parse(params);
    const body = await request.json();
    const validatedData = updateFormSchema.parse(body);

    // Check if form exists
    const [existingForm] = await db
      .select()
      .from(forms)
      .where(eq(forms.id, id))
      .limit(1);

    if (!existingForm) {
      return handleApiError("form not found");
    }

    // Update form
    const [updatedForm] = await db
      .update(forms)
      .set(validatedData)
      .where(eq(forms.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedForm,
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
    const { id } = formParamsSchema.parse(params);

    // Check if form exists
    const [existingForm] = await db
      .select()
      .from(forms)
      .where(eq(forms.id, id))
      .limit(1);

    if (!existingForm) {
      throw new Error("Form not found");
    }

    // Delete form
    await db.delete(forms).where(eq(forms.id, id));

    return NextResponse.json({
      success: true,
      data: {
        message: "Form deleted successfully",
        deletedForm: existingForm,
      },
    });
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}
