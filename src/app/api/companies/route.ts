import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import {
  createCompanySchema,
  companyQuerySchema,
} from "@/lib/validations/company";
import { eq, ilike, and, or, asc, desc } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedQuery = companyQuerySchema.parse(queryParams);

    const { page, limit, industry, size, search, sortBy, sortOrder } =
      validatedQuery;

    const offset = (page - 1) * limit;

    let whereConditions = [];

    if (industry) {
      whereConditions.push(eq(companies.industry, industry));
    }

    if (size) {
      whereConditions.push(eq(companies.size, size));
    }

    if (search) {
      whereConditions.push(ilike(companies.name, `%${search}%`));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const orderByClause =
      sortOrder === "asc"
        ? asc(companies.createdAt)
        : desc(companies.createdAt);

    const [companyList, totalCountResult] = await Promise.all([
      db
        .select()
        .from(companies)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),

      db.select({ count: companies.id }).from(companies).where(whereClause),
    ]);

    const totalCount = totalCountResult.length;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        companies: companyList,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
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
    const validatedData = createCompanySchema.parse(body);

    const [newCompany] = await db
      .insert(companies)
      .values(validatedData)
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: newCompany,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}
