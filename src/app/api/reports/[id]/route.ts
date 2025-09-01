import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reports } from "@/lib/db/schema";
import {
  updateReportSchema,
  reportParamsSchema,
} from "@/lib/validations/report";
import { eq } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = reportParamsSchema.parse(await params);

    const [report] = await db
      .select()
      .from(reports)
      .where(eq(reports.id, id))
      .limit(1);

    if (!report) {
      return handleApiError("report not found");
    }

    return NextResponse.json({
      success: true,
      data: report,
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
    const { id } = reportParamsSchema.parse(await params);
    const body = await request.json();
    const validatedData = updateReportSchema.parse(body);

    // Check if report exists
    const [existingReport] = await db
      .select()
      .from(reports)
      .where(eq(reports.id, id))
      .limit(1);

    if (!existingReport) {
      return handleApiError("report not found");
    }

    // Update report
    const [updatedReport] = await db
      .update(reports)
      .set(validatedData)
      .where(eq(reports.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedReport,
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
    const { id } = reportParamsSchema.parse(await params);

    // Check if report exists
    const [existingReport] = await db
      .select()
      .from(reports)
      .where(eq(reports.id, id))
      .limit(1);

    if (!existingReport) {
      return handleApiError("report not found");
    }

    // Delete report
    await db.delete(reports).where(eq(reports.id, id));

    return NextResponse.json({
      success: true,
      data: {
        message: "Report deleted successfully",
        deletedReport: existingReport,
      },
    });
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}