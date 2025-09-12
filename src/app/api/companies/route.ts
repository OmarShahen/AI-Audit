import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { companies, forms } from "@/lib/db/schema";
import {
  createCompanySchema,
  companyQuerySchema,
} from "@/lib/validations/company";
import { eq, ilike, and, asc, desc } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedQuery = companyQuerySchema.parse(queryParams);

    const { page, limit, industry, size, search, sortOrder } = validatedQuery;

    const offset = (page - 1) * limit;

    const whereConditions = [];

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
        .leftJoin(forms, eq(companies.formId, forms.id))
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
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        companies: companyList,
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

    if(validatedData.formId) {
      const form = db.query.forms.findFirst({
        where: eq(forms.id, validatedData.formId),
      })

      if (!form) {
      throw new Error("Form not found");
    }
    }

    if(validatedData.type == 'client' && !validatedData.partnerId) {
      throw new Error('Partner ID is required')
    }

    if(validatedData.partnerId) {
      const partner = await db.query.companies.findFirst({ where: eq(companies.id, validatedData.partnerId) })
      if(!partner) {
        throw new Error('Partner not found')
      }
    }

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
