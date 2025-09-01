import { z } from "zod";

export const createQuestionConditionalSchema = z.object({
  questionId: z
    .number("Question ID is required")
    .int("Question ID must be an integer")
    .positive("Question ID must be a positive integer"),
  conditionQuestionId: z
    .number("Condition Question ID is required")
    .int("Condition Question ID must be an integer")
    .positive("Condition Question ID must be a positive integer"),
  conditionValue: z
    .string("Condition value is required")
    .min(1, "Condition value is required")
    .max(255, "Condition value must be less than 255 characters")
    .trim(),
  showQuestion: z
    .boolean("Show question must be a boolean")
    .default(true),
});

export const updateQuestionConditionalSchema = z.object({
  questionId: z
    .number("Question ID must be a number")
    .int("Question ID must be an integer")
    .positive("Question ID must be a positive integer")
    .optional(),
  conditionQuestionId: z
    .number("Condition Question ID must be a number")
    .int("Condition Question ID must be an integer")
    .positive("Condition Question ID must be a positive integer")
    .optional(),
  conditionValue: z
    .string("Condition value must be a string")
    .min(1, "Condition value is required")
    .max(255, "Condition value must be less than 255 characters")
    .trim()
    .optional(),
  showQuestion: z.boolean("Show question must be a boolean").optional(),
});

export const questionConditionalParamsSchema = z.object({
  id: z
    .string("Question conditional ID is required")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Invalid question conditional ID",
    }),
});

export const questionConditionalQuerySchema = z.object({
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
  questionId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Question ID must be a positive number",
    })
    .optional(),
  conditionQuestionId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Condition Question ID must be a positive number",
    })
    .optional(),
  showQuestion: z
    .string()
    .transform((val) => val.toLowerCase() === "true")
    .optional(),
  sortBy: z
    .enum(["conditionValue"])
    .default("conditionValue"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type CreateQuestionConditional = z.infer<typeof createQuestionConditionalSchema>;
export type UpdateQuestionConditional = z.infer<typeof updateQuestionConditionalSchema>;
export type QuestionConditionalParams = z.infer<typeof questionConditionalParamsSchema>;
export type QuestionConditionalQuery = z.infer<typeof questionConditionalQuerySchema>;