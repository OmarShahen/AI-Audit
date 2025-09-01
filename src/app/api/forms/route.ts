import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forms } from "@/lib/db/schema";
import { createFormSchema, formQuerySchema } from "@/lib/validations/form";
import { eq, ilike, and, asc, desc } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedQuery = formQuerySchema.parse(queryParams);

    const { page, limit, search, sortBy, sortOrder } = validatedQuery;

    const offset = (page - 1) * limit;

    let whereConditions = [];

    if (search) {
      whereConditions.push(ilike(forms.title, `%${search}%`));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const orderByClause =
      sortOrder === "asc" ? asc(forms.createdAt) : desc(forms.createdAt);

    const [formsList, totalCountResult] = await Promise.all([
      db
        .select()
        .from(forms)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),

      db.select({ count: forms.id }).from(forms).where(whereClause),
    ]);

    const totalCount = totalCountResult.length;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        forms: formsList,
      },
    });
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createFormSchema.parse(body);

    const [formExist] = await db
      .select()
      .from(forms)
      .where(eq(forms.title, validatedData.title))
      .limit(1);
    if (formExist) {
      throw new Error("Form title already registered");
    }

    const [newForm] = await db.insert(forms).values(validatedData).returning();

    return NextResponse.json(
      {
        success: true,
        data: newForm,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}
