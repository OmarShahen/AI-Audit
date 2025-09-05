import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { submissions, companies, forms } from "@/lib/db/schema";
import {
  createSubmissionSchema,
  submissionQuerySchema,
} from "@/lib/validations/submission";
import { eq, and, asc, desc } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedQuery = submissionQuerySchema.parse(queryParams);

    const { page, limit, formId, companyId, sortOrder } = validatedQuery;

    const offset = (page - 1) * limit;

    const whereConditions = [];

    if (formId) {
      whereConditions.push(eq(submissions.formId, formId));
    }

    if (companyId) {
      whereConditions.push(eq(submissions.companyId, companyId));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const orderByClause =
      sortOrder === "asc"
        ? asc(submissions.createdAt)
        : desc(submissions.createdAt);

    const [submissionsList, totalCountResult] = await Promise.all([
      db
        .select()
        .from(submissions)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),

      db.select({ count: submissions.id }).from(submissions).where(whereClause),
    ]);

    const totalCount = totalCountResult.length;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        submissions: submissionsList,
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

    const validatedData = createSubmissionSchema.parse(body);

    const [company, form] = await Promise.all([
      db.query.companies.findFirst({
        where: eq(companies.id, validatedData.companyId),
      }),
      db.query.forms.findFirst({ where: eq(forms.id, validatedData.formId) }),
    ]);

    if (!company) {
      throw new Error("Company not found");
    }

    if (!form) {
      throw new Error("Form not found");
    }

    const [newSubmission] = await db
      .insert(submissions)
      .values(validatedData)
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: newSubmission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}
