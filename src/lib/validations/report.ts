import { z } from "zod";

export const createReportSchema = z.object({
  submissionId: z
    .number("Submission ID is required")
    .int("Submission ID must be an integer")
    .positive("Submission ID must be a positive integer"),
  title: z
    .string("Report title is required")
    .min(1, "Report title is required")
    .max(255, "Report title must be less than 255 characters")
    .trim(),
  content: z
    .string("Report content is required")
    .min(1, "Report content is required")
    .trim(),
});

export const updateReportSchema = z.object({
  title: z
    .string("Report title must be a string")
    .min(1, "Report title is required")
    .max(255, "Report title must be less than 255 characters")
    .trim()
    .optional(),
  content: z
    .string("Report content must be a string")
    .min(1, "Report content is required")
    .trim()
    .optional(),
});

export const reportParamsSchema = z.object({
  id: z
    .string("Report ID is required")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Invalid report ID",
    }),
});

export const reportQuerySchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Page must be a positive number",
    })
    .default(1),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0 && val <= 100, {
      message: "Limit must be between 1 and 100",
    })
    .default(10),
  submissionId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Submission ID must be a positive number",
    })
    .optional(),
  search: z
    .string("Search term must be a string")
    .max(255, "Search term must be less than 255 characters")
    .optional(),
  sortBy: z.enum(["title", "createdAt", "generatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Schema for generating reports via OpenAI
export const generateReportSchema = z.object({
  submissionId: z
    .number("submission ID is required")
    .positive("Submission ID must be a positive number"),
  email: z.string("Email is required").email("Valid email is required"),
});

export type CreateReport = z.infer<typeof createReportSchema>;
export type UpdateReport = z.infer<typeof updateReportSchema>;
export type ReportParams = z.infer<typeof reportParamsSchema>;
export type ReportQuery = z.infer<typeof reportQuerySchema>;
export type GenerateReport = z.infer<typeof generateReportSchema>;
