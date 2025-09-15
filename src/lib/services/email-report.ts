// Unified email service for sending reports with Word document attachments
import { sendEmail } from "./email";
import { generateWordFromText } from "./docx";
import { createReportEmailHTML } from "./email-templates";

export interface SendReportEmailParams {
  email: string;
  reportText: string;
  subject: string;
  attachmentName: string;
  format?: 'markdown' | 'plain';
  additionalAttachments?: {
    filename: string;
    content: Buffer;
    contentType: string;
  }[];
}

export interface EmailResult {
  success: boolean;
  error?: string;
  data?: {
    recipient: string;
    subject: string;
    attachmentName: string;
    format: string;
  };
}

export async function sendReportEmail(params: SendReportEmailParams): Promise<EmailResult> {
  try {
    const { email, reportText, subject, attachmentName, format = 'markdown', additionalAttachments = [] } = params;

    // Generate Word document from report text
    const docxBuffer = await generateWordFromText(reportText, subject, format);

    // Create professional email HTML content
    const htmlContent = createReportEmailHTML(subject, email, attachmentName);

    // Ensure attachment has .docx extension
    const finalAttachmentName = attachmentName.endsWith(".docx")
      ? attachmentName
      : `${attachmentName}.docx`;

    // Prepare all attachments
    const allAttachments = [
      {
        filename: finalAttachmentName,
        content: docxBuffer,
        contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
      ...additionalAttachments,
    ];

    // Send email with Word document attachment
    const emailResult = await sendEmail({
      to: email,
      subject: subject,
      html: htmlContent,
      attachments: allAttachments,
    });

    if (!emailResult.success) {
      return {
        success: false,
        error: emailResult.error || "Failed to send email",
      };
    }

    return {
      success: true,
      data: {
        recipient: email,
        subject: subject,
        attachmentName: finalAttachmentName,
        format: format,
      },
    };
  } catch (error) {
    console.error("Send report email error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}