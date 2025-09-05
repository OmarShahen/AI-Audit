import { z } from "zod";

export const createQuestionConditionalSchema = z.object({
  questionId: z
    .number()
    .int("Question ID must be an integer")
    .positive("Question ID must be a positive integer"),
  conditionQuestionId: z
    .number()
    .int("Condition Question ID must be an integer")
    .positive("Condition Question ID must be a positive integer"),
  conditionValue: z
    .string()
    .min(1, "Condition value is required")
    .max(255, "Condition value must be less than 255 characters")
    .trim(),
  showQuestion: z.boolean().default(true),
});

export const updateQuestionConditionalSchema = z.object({
  questionId: z
    .number()
    .int("Question ID must be an integer")
    .positive("Question ID must be a positive integer")
    .optional(),
  conditionQuestionId: z
    .number()
    .int("Condition Question ID must be an integer")
    .positive("Condition Question ID must be a positive integer")
    .optional(),
  conditionValue: z
    .string()
    .min(1, "Condition value is required")
    .max(255, "Condition value must be less than 255 characters")
    .trim()
    .optional(),
  showQuestion: z.boolean().optional(),
});

export const questionConditionalParamsSchema = z.object({
  id: z
    .string()
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
    }),
  limit: z
    .string()
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
  sortBy: z.enum(["conditionValue"]).default("conditionValue"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type CreateQuestionConditional = z.infer<
  typeof createQuestionConditionalSchema
>;
export type UpdateQuestionConditional = z.infer<
  typeof updateQuestionConditionalSchema
>;
export type QuestionConditionalParams = z.infer<
  typeof questionConditionalParamsSchema
>;
export type QuestionConditionalQuery = z.infer<
  typeof questionConditionalQuerySchema
>;
