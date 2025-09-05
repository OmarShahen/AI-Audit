import { z } from "zod";

export const sendEmailSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address")
    .trim(),
  text: z
    .string()
    .min(1, "Report content is required")
    .max(100000, "Report content must be less than 100,000 characters")
    .trim(),
  subject: z
    .string()
    .min(1, "Email subject is required")
    .max(255, "Email subject must be less than 255 characters")
    .trim()
    .optional()
    .default("Audit Report"),
  attachmentName: z
    .string()
    .min(1, "Attachment name is required")
    .max(255, "Attachment name must be less than 255 characters")
    .trim()
    .optional()
    .default("audit-report"),
  format: z
    .enum(["markdown", "plain", "auto"])
    .optional()
    .default("auto")
    .describe(
      "Format of the input text: 'markdown' to force markdown parsing, 'plain' to treat as plain text, 'auto' to detect automatically"
    ),
});

export type SendEmail = z.infer<typeof sendEmailSchema>;
