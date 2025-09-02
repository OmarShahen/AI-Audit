import { z } from "zod";

export const questionTypeSchema = z.enum(
  ["text", "multiple_choice", "checkbox", "conditional"],
  { error: "Invalid question type value" }
);

export const createQuestionSchema = z.object({
  categoryId: z
    .number("Category ID is required")
    .int("Category ID must be an integer")
    .positive("Category ID must be a positive integer"),
  text: z
    .string("Question text is required")
    .min(1, "Question text is required")
    .trim(),
  type: questionTypeSchema,
  required: z.boolean("Required field must be a boolean").default(true),
  order: z
    .number("Order must be a number")
    .int("Order must be an integer")
    .min(0, "Order must be a non-negative integer")
    .default(0),
});

export const updateQuestionSchema = z.object({
  text: z
    .string("Question text must be a string")
    .min(1, "Question text is required")
    .trim()
    .optional(),
  type: questionTypeSchema.optional(),
  required: z.boolean("Required field must be a boolean").optional(),
  order: z
    .number("Order must be a number")
    .int("Order must be an integer")
    .min(0, "Order must be a non-negative integer")
    .optional(),
});

export const questionParamsSchema = z.object({
  id: z
    .string("Question ID is required")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Invalid question ID",
    }),
});

export const questionQuerySchema = z.object({
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
  categoryId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Category ID must be a positive number",
    })
    .optional(),
  type: questionTypeSchema.optional(),
  required: z
    .string()
    .transform((val) => val.toLowerCase() === "true")
    .optional(),
  search: z
    .string("Search term must be a string")
    .max(255, "Search term must be less than 255 characters")
    .optional(),
  sortBy: z.enum(["text", "createdAt", "order", "type"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type QuestionType = z.infer<typeof questionTypeSchema>;
export type CreateQuestion = z.infer<typeof createQuestionSchema>;
export type UpdateQuestion = z.infer<typeof updateQuestionSchema>;
export type QuestionParams = z.infer<typeof questionParamsSchema>;
export type QuestionQuery = z.infer<typeof questionQuerySchema>;
