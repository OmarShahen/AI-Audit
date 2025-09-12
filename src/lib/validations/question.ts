import { z } from "zod";

export const questionTypeSchema = z.enum([
  "text",
  "multiple_choice",
  "checkbox",
  "conditional",
]);

export const questionOptionSchema = z.object({
  text: z.string().min(1, "Option text is required").trim(),
  value: z.string().min(1, "Option value is required").trim(),
  order: z.number().int().min(0).default(0),
});

export const questionConditionalSchema = z.object({
  conditionQuestionId: z
    .number()
    .int()
    .positive("Condition question ID must be a positive integer"),
  conditionValues: z
    .array(z.string().min(1, "Condition value cannot be empty").trim())
    .min(1, "At least one condition value is required")
    .max(10, "Maximum 10 condition values allowed"),
  showQuestion: z.boolean().default(true),
  operator: z.enum(["AND", "OR"]).default("OR"),
});

export const createQuestionSchema = z
  .object({
    categoryId: z
      .number()
      .int("Category ID must be an integer")
      .positive("Category ID must be a positive integer"),
    text: z.string().min(1, "Question text is required").trim(),
    type: questionTypeSchema,
    required: z.boolean().default(true),
    order: z
      .number()
      .int("Order must be an integer")
      .min(0, "Order must be a non-negative integer")
      .default(0),
      placeholder: z.string().optional(),
    options: z.array(questionOptionSchema).optional(),
    conditionals: z.array(questionConditionalSchema).optional(),
  })
  .refine(
    (data) => {
      // If question type is multiple_choice or checkbox, options are required
      if (
        ["multiple_choice", "checkbox"].includes(data.type) &&
        (!data.options || data.options.length === 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Options are required for multiple choice and checkbox questions",
      path: ["options"],
    }
  );

export const updateQuestionSchema = z.object({
  text: z.string().min(1, "Question text is required").trim().optional(),
  type: questionTypeSchema.optional(),
  required: z.boolean().optional(),
  order: z
    .number()
    .int("Order must be an integer")
    .min(0, "Order must be a non-negative integer")
    .optional(),
  placeholder: z.string().optional(),
  options: z.array(questionOptionSchema).optional(),
  conditionals: z.array(questionConditionalSchema).optional(),
});

export const questionParamsSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Invalid question ID",
    }),
});

export const questionQuerySchema = z.object({
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
    .string()
    .max(255, "Search term must be less than 255 characters")
    .optional(),
  sortBy: z.enum(["text", "createdAt", "order", "type"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type QuestionType = z.infer<typeof questionTypeSchema>;
export type QuestionOption = z.infer<typeof questionOptionSchema>;
export type QuestionConditional = z.infer<typeof questionConditionalSchema>;
export type CreateQuestion = z.infer<typeof createQuestionSchema>;
export type UpdateQuestion = z.infer<typeof updateQuestionSchema>;
export type QuestionParams = z.infer<typeof questionParamsSchema>;
export type QuestionQuery = z.infer<typeof questionQuerySchema>;
