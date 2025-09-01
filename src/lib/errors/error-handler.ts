import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleApiError(error: unknown) {
  console.error(error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        accepted: false,
        error: error.issues[0]?.message || "Validation failed",
      },
      { status: 400 }
    );
  }

  // Handle custom thrown errors
  if (error instanceof Error) {
    return NextResponse.json(
      {
        accepted: false,
        error: error.message,
      },
      { status: 400 }
    );
  }

  // Handle other errors
  return NextResponse.json(
    {
      accepted: false,
      error: "Internal server error",
    },
    { status: 500 }
  );
}
