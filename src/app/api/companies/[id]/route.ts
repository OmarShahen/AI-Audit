import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import {
  updateCompanySchema,
  companyParamsSchema,
} from "@/lib/validations/company";
import { eq } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = companyParamsSchema.parse(await params);

    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, id))
      .limit(1);

    if (!company) {
      return handleApiError("company not found");
    }

    return NextResponse.json({
      success: true,
      data: company,
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
    const { id } = companyParamsSchema.parse(await params);
    const body = await request.json();
    const validatedData = updateCompanySchema.parse(body);

    // Check if company exists
    const [existingCompany] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, id))
      .limit(1);

    if (!existingCompany) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "COMPANY_NOT_FOUND",
            message: `Company with ID ${id} not found`,
          },
        },
        { status: 404 }
      );
    }

    // Update company
    const [updatedCompany] = await db
      .update(companies)
      .set(validatedData)
      .where(eq(companies.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedCompany,
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
    const { id } = companyParamsSchema.parse(await params);

    // Check if company exists
    const [existingCompany] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, id))
      .limit(1);

    if (!existingCompany) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "COMPANY_NOT_FOUND",
            message: `Company with ID ${id} not found`,
          },
        },
        { status: 404 }
      );
    }

    // Delete company
    await db.delete(companies).where(eq(companies.id, id));

    return NextResponse.json({
      success: true,
      data: {
        message: "Company deleted successfully",
        deletedCompany: existingCompany,
      },
    });
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}
