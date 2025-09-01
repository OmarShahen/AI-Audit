import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reports } from "@/lib/db/schema";
import {
  createReportSchema,
  reportQuerySchema,
} from "@/lib/validations/report";
import { eq, ilike, and, asc, desc } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedQuery = reportQuerySchema.parse(queryParams);

    const { page, limit, submissionId, search, sortBy, sortOrder } = validatedQuery;

    const offset = (page - 1) * limit;

    let whereConditions = [];

    if (submissionId) {
      whereConditions.push(eq(reports.submissionId, submissionId));
    }

    if (search) {
      whereConditions.push(ilike(reports.title, `%${search}%`));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const orderByClause =
      sortOrder === "asc"
        ? asc(reports.createdAt)
        : desc(reports.createdAt);

    const [reportsList, totalCountResult] = await Promise.all([
      db
        .select()
        .from(reports)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),

      db
        .select({ count: reports.id })
        .from(reports)
        .where(whereClause),
    ]);

    const totalCount = totalCountResult.length;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        reports: reportsList,
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
    const validatedData = createReportSchema.parse(body);

    const [newReport] = await db
      .insert(reports)
      .values(validatedData)
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: newReport,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}