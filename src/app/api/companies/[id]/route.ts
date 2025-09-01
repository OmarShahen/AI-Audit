import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { companies, forms } from "@/lib/db/schema";
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
      throw new Error("company not registered");
    }

    if (validatedData.name && validatedData.name != existingCompany.name) {
      const [existingCompanyName] = await db
        .select()
        .from(companies)
        .where(eq(companies.name, validatedData.name))
        .limit(1);
      if (existingCompanyName) {
        throw new Error("Company name already registered");
      }
    }

    if (
      validatedData.formId &&
      validatedData.formId != existingCompany.formId
    ) {
      const [form] = await db
        .select()
        .from(forms)
        .where(eq(forms.id, validatedData.formId))
        .limit(1);
      if (!form) {
        throw new Error("Form not found");
      }
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
      throw new Error("company not found");
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
