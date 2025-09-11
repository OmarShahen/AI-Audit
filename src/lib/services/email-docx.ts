import { sendEmail } from "./email";
import { createDocxEmailHTML, DocxEmailTemplateData } from "./email-templates";
import { SubmissionDocumentData } from "./docx-qa";

export interface DocxEmailData {
  email: string;
  docxBuffer: Buffer;
  fileName: string;
  documentData: SubmissionDocumentData;
}

export async function sendDocxEmail(data: DocxEmailData) {
  const { email, docxBuffer, fileName, documentData } = data;
  const { company, submission, totalQuestions } = documentData;
  
  // Prepare email template data
  const templateData: DocxEmailTemplateData = {
    companyName: company.name,
    industry: company.industry,
    submissionDate: new Date(submission.createdAt).toLocaleDateString(),
    totalQuestions,
    fileName,
  };
  
  // Generate email HTML
  const emailHtml = createDocxEmailHTML(templateData);
  
  // Email subject
  const subject = `${company.name} - Audit Responses Document`;
  
  // Send email with attachment
  const emailResult = await sendEmail({
    to: email,
    subject,
    html: emailHtml,
    attachments: [
      {
        filename: fileName,
        content: docxBuffer,
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    ],
  });

  if (!emailResult.success) {
    throw new Error("Failed to send email with document attachment");
  }

  return {
    success: true,
    emailData: emailResult.data,
    documentInfo: {
      fileName,
      companyName: company.name,
      totalQuestions,
    },
  };
}