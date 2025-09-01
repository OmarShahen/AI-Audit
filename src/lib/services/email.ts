import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const emailData: {from: string; to: string; subject: string; html: string; attachments?: Array<{filename: string; content: Buffer; contentType: string}>} = {
      from: process.env.FROM_EMAIL || 'noreply@audit.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    if (options.attachments && options.attachments.length > 0) {
      emailData.attachments = options.attachments;
    }

    const result = await resend.emails.send(emailData);
    
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Email sending failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}