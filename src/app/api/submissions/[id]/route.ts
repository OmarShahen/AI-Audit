import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";
import {
  updateSubmissionSchema,
  submissionParamsSchema,
} from "@/lib/validations/submission";
import { eq } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = submissionParamsSchema.parse(params);

    const [submission] = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, id))
      .limit(1);

    if (!submission) {
      return handleApiError("submission not found");
    }

    return NextResponse.json({
      success: true,
      data: submission,
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
    const { id } = submissionParamsSchema.parse(params);
    const body = await request.json();
    const validatedData = updateSubmissionSchema.parse(body);

    // Check if submission exists
    const [existingSubmission] = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, id))
      .limit(1);

    if (!existingSubmission) {
      return handleApiError("submission not found");
    }

    // Update submission
    const [updatedSubmission] = await db
      .update(submissions)
      .set(validatedData)
      .where(eq(submissions.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedSubmission,
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
    const { id } = submissionParamsSchema.parse(params);

    // Check if submission exists
    const [existingSubmission] = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, id))
      .limit(1);

    if (!existingSubmission) {
      return handleApiError("submission not found");
    }

    // Delete submission
    await db.delete(submissions).where(eq(submissions.id, id));

    return NextResponse.json({
      success: true,
      data: {
        message: "Submission deleted successfully",
        deletedSubmission: existingSubmission,
      },
    });
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}