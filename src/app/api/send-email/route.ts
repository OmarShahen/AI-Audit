import { NextRequest, NextResponse } from "next/server";
import { sendEmailSchema } from "@/lib/validations/email";
import { sendEmail } from "@/lib/services/email";
import { generatePDFFromText } from "@/lib/services/pdf";
import { createReportEmailHTML } from "@/lib/services/email-templates";
import { handleApiError } from "@/lib/errors/error-handler";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = sendEmailSchema.parse(body);

    const { email, text, subject, attachmentName, format } = validatedData;

    // Generate PDF from text (with markdown support)
    const pdfBuffer = await generatePDFFromText(text, subject, format);

    // Create professional email HTML content
    const htmlContent = createReportEmailHTML(subject, email, attachmentName);

    // Send email with PDF attachment
    const emailResult = await sendEmail({
      to: email,
      subject: subject,
      html: htmlContent,
      attachments: [
        {
          filename: attachmentName.endsWith(".pdf")
            ? attachmentName
            : `${attachmentName}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "EMAIL_SEND_FAILED",
            message: emailResult.error || "Failed to send email",
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        message: "Email sent successfully",
        recipient: email,
        subject: subject,
        attachmentName: attachmentName.endsWith(".pdf")
          ? attachmentName
          : `${attachmentName}.pdf`,
        format: format,
      },
    });
  } catch (error) {
    console.error("Send email error:", error);
    return handleApiError(error);
  }
}
