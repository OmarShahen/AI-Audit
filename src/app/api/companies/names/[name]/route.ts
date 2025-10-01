import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { handleApiError } from "@/lib/errors/error-handler";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;

    const [company] = await db
      .select()
      .from(companies)
      .where(and(eq(companies.name, name), eq(companies.type, "partner")))
      .limit(1);

    if (!company) {
      throw new Error("Company not found");
    }

    return NextResponse.json({ success: true, company }, { status: 200 });
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}
