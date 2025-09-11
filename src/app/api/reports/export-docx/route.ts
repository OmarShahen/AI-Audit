import { NextRequest, NextResponse } from "next/server";
import { generateReportSchema } from "@/lib/validations/report";
import { handleApiError } from "@/lib/errors/error-handler";
import { generateQADocument } from "@/lib/services/docx-qa";
import { sendDocxEmail } from "@/lib/services/email-docx";

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body = await request.json();
    const validatedData = generateReportSchema.parse(body);

    // Generate the Q&A document
    const { docxBuffer, fileName, documentData } = await generateQADocument(
      validatedData.submissionId
    );

    // Send the document via email
    const emailResult = await sendDocxEmail({
      email: validatedData.email,
      docxBuffer,
      fileName,
      documentData,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Document generated and sent successfully!",
        emailData: emailResult.emailData,
        documentInfo: emailResult.documentInfo,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error generating and sending DOCX:", error);
    return handleApiError(error);
  }
}