import { z } from "zod";

export const createQuestionOptionSchema = z.object({
  questionId: z
    .number()
    .int("Question ID must be an integer")
    .positive("Question ID must be a positive integer"),
  text: z
    .string()
    .min(1, "Option text is required")
    .max(255, "Option text must be less than 255 characters")
    .trim(),
  value: z
    .string()
    .min(1, "Option value is required")
    .max(255, "Option value must be less than 255 characters")
    .trim(),
  order: z
    .number()
    .int("Order must be an integer")
    .min(0, "Order must be a non-negative integer")
    .default(0),
});

export const updateQuestionOptionSchema = z.object({
  questionId: z
    .number()
    .int("Question ID must be an integer")
    .positive("Question ID must be a positive integer")
    .optional(),
  text: z
    .string()
    .min(1, "Option text is required")
    .max(255, "Option text must be less than 255 characters")
    .trim()
    .optional(),
  value: z
    .string()
    .min(1, "Option value is required")
    .max(255, "Option value must be less than 255 characters")
    .trim()
    .optional(),
  order: z
    .number()
    .int("Order must be an integer")
    .min(0, "Order must be a non-negative integer")
    .optional(),
});

export const questionOptionParamsSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Invalid question option ID",
    }),
});

export const questionOptionQuerySchema = z.object({
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
  sortBy: z.enum(["text", "value", "order"]).default("order"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type CreateQuestionOption = z.infer<typeof createQuestionOptionSchema>;
export type UpdateQuestionOption = z.infer<typeof updateQuestionOptionSchema>;
export type QuestionOptionParams = z.infer<typeof questionOptionParamsSchema>;
export type QuestionOptionQuery = z.infer<typeof questionOptionQuerySchema>;
