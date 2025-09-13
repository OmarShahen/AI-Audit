import { sendEmail } from "./email";
import { generateWordFromText } from "./docx";
import { generateQADocument } from "./docx-qa";

export interface AgencyEmailData {
  email: string;
  clientReport: string;
  internalReport: string;
  submissionId: number;
}

export interface AgencyEmailResult {
  success: boolean;
  error?: string;
  emailData?: any;
}

export async function sendAgencyEmail(data: AgencyEmailData): Promise<AgencyEmailResult> {
  try {
    const { 
      email, 
      clientReport, 
      internalReport, 
      submissionId
    } = data;

    // Generate QA document and Word documents from both reports in parallel
    const [qaDocument, clientReportBuffer, internalReportBuffer] = await Promise.all([
      generateQADocument(submissionId),
      generateWordFromText(
        clientReport, 
        `Client Report`, 
        'markdown'
      ),
      generateWordFromText(
        internalReport, 
        `Internal Agency Report`, 
        'markdown'
      ),
    ]);

    const { company } = qaDocument.documentData;

    // Create professional email HTML content
    const htmlContent = createAgencyEmailHTML(company.name);

    // Prepare all attachments
    const attachments = [
      {
        filename: `${company.name}-client-report.docx`,
        content: clientReportBuffer,
        contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
      {
        filename: `${company.name}-internal-agency-report.docx`,
        content: internalReportBuffer,
        contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
      {
        filename: qaDocument.fileName,
        content: qaDocument.docxBuffer,
        contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    ];

    // Send email with all attachments
    const emailResult = await sendEmail({
      to: email,
      subject: `Complete Audit Package - ${company.name}`,
      html: htmlContent,
      attachments,
    });

    if (!emailResult.success) {
      return {
        success: false,
        error: emailResult.error || "Failed to send agency email",
      };
    }

    return {
      success: true,
      emailData: emailResult.data,
    };
  } catch (error) {
    console.error("Send agency email error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

function createAgencyEmailHTML(companyName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complete Audit Package</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                Complete Audit Package
            </h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                ${companyName} - Full Analysis Package
            </p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #333333; margin-top: 0; font-size: 24px;">Package Contents</h2>
            
            <div style="margin: 30px 0;">
                <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 20px;">
                    <h3 style="color: #333333; margin: 0 0 10px 0; font-size: 18px;">📄 Client Report</h3>
                    <p style="color: #666666; margin: 0; line-height: 1.6;">
                        Professional report formatted for client presentation containing insights and recommendations.
                    </p>
                </div>
                
                <div style="background-color: #f8f9fa; border-left: 4px solid #764ba2; padding: 20px; margin-bottom: 20px;">
                    <h3 style="color: #333333; margin: 0 0 10px 0; font-size: 18px;">🔍 Internal Agency Report</h3>
                    <p style="color: #666666; margin: 0; line-height: 1.6;">
                        Detailed internal analysis with strategic insights for agency use and client management.
                    </p>
                </div>
                
                <div style="background-color: #f8f9fa; border-left: 4px solid #28a745; padding: 20px;">
                    <h3 style="color: #333333; margin: 0 0 10px 0; font-size: 18px;">❓ Q&A Document</h3>
                    <p style="color: #666666; margin: 0; line-height: 1.6;">
                        Complete question and answer document with all client responses for reference.
                    </p>
                </div>
            </div>
            
            <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; border: 1px solid #bbdefb;">
                <p style="color: #1976d2; margin: 0; font-weight: bold; text-align: center;">
                    All documents are attached to this email in Word format (.docx)
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="color: #666666; margin: 0; font-size: 14px;">
                Generated automatically by the AI Audit System
            </p>
            <p style="color: #999999; margin: 5px 0 0 0; font-size: 12px;">
                ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}
            </p>
        </div>
    </div>
</body>
</html>`;
}