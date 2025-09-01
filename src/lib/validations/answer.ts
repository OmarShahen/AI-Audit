import { z } from "zod";

export const createAnswerSchema = z.object({
  submissionId: z
    .number("Submission ID is required")
    .int("Submission ID must be an integer")
    .positive("Submission ID must be a positive integer"),
  questionId: z
    .number("Question ID is required")
    .int("Question ID must be an integer")
    .positive("Question ID must be a positive integer"),
  value: z
    .string("Answer value is required")
    .min(1, "Answer value is required")
    .trim(),
});

export const updateAnswerSchema = z.object({
  submissionId: z
    .number("Submission ID must be a number")
    .int("Submission ID must be an integer")
    .positive("Submission ID must be a positive integer")
    .optional(),
  questionId: z
    .number("Question ID must be a number")
    .int("Question ID must be an integer")
    .positive("Question ID must be a positive integer")
    .optional(),
  value: z
    .string("Answer value must be a string")
    .min(1, "Answer value is required")
    .trim()
    .optional(),
});

export const answerParamsSchema = z.object({
  id: z
    .string("Answer ID is required")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Invalid answer ID",
    }),
});

export const answerQuerySchema = z.object({
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
  questionId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Question ID must be a positive number",
    })
    .optional(),
  search: z
    .string("Search term must be a string")
    .max(255, "Search term must be less than 255 characters")
    .optional(),
  sortBy: z
    .enum(["value", "createdAt"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateAnswer = z.infer<typeof createAnswerSchema>;
export type UpdateAnswer = z.infer<typeof updateAnswerSchema>;
export type AnswerParams = z.infer<typeof answerParamsSchema>;
export type AnswerQuery = z.infer<typeof answerQuerySchema>;