import { z } from "zod";

export const createAnswerSchema = z.object({
  submissionId: z
    .number()
    .int("Submission ID must be an integer")
    .positive("Submission ID must be a positive integer"),
  questionId: z
    .number()
    .int("Question ID must be an integer")
    .positive("Question ID must be a positive integer"),
  value: z.string().min(1, "Answer value is required").trim(),
});

export const updateAnswerSchema = z.object({
  submissionId: z
    .number()
    .int("Submission ID must be an integer")
    .positive("Submission ID must be a positive integer")
    .optional(),
  questionId: z
    .number()
    .int("Question ID must be an integer")
    .positive("Question ID must be a positive integer")
    .optional(),
  value: z.string().min(1, "Answer value is required").trim().optional(),
});

export const answerParamsSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Invalid answer ID",
    }),
});

export const answerQuerySchema = z.object({
  page: z
    .string()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Page must be a positive number",
    }),
  limit: z
    .string()
    .default("10")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0 && val <= 100, {
      message: "Limit must be between 1 and 100",
    }),
  submissionId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Submission ID must be a positive number",
    })
    .optional(),
  questionId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Question ID must be a positive number",
    })
    .optional(),
  search: z
    .string()
    .max(255, "Search term must be less than 255 characters")
    .optional(),
  sortBy: z.enum(["value", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateAnswer = z.infer<typeof createAnswerSchema>;
export type UpdateAnswer = z.infer<typeof updateAnswerSchema>;
export type AnswerParams = z.infer<typeof answerParamsSchema>;
export type AnswerQuery = z.infer<typeof answerQuerySchema>;
