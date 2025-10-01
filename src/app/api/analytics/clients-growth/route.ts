import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { sql, eq } from "drizzle-orm";
import { handleApiError } from "@/lib/errors/error-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupBy = searchParams.get("groupBy") || "month"; // year, month, day
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let dateFormat: string;
    let labelFormat: string;

    switch (groupBy) {
      case "year":
        dateFormat = "%Y";
        labelFormat = "YYYY";
        break;
      case "day":
        dateFormat = "%Y-%m-%d";
        labelFormat = "YYYY-MM-DD";
        break;
      case "month":
      default:
        dateFormat = "%Y-%m";
        labelFormat = "YYYY-MM";
        break;
    }

    let query = db
      .select({
        period: sql<string>`strftime(${dateFormat}, ${companies.createdAt})`.as("period"),
        count: sql<number>`count(*)`.as("count"),
      })
      .from(companies)
      .where(eq(companies.type, "client"));

    // Add date range filtering if provided
    if (startDate && endDate) {
      query = query.where(
        sql`${companies.type} = 'client' AND ${companies.createdAt} >= ${startDate} AND ${companies.createdAt} <= ${endDate}`
      ) as any;
    }

    const results = await query
      .groupBy(sql`period`)
      .orderBy(sql`period ASC`);

    // Format the results
    const formattedResults = results.map((row) => ({
      label: row.period,
      value: row.count,
    }));

    return NextResponse.json({
      success: true,
      data: formattedResults,
    });
  } catch (error) {
    console.error("Error fetching clients growth:", error);
    return handleApiError(error);
  }
}
