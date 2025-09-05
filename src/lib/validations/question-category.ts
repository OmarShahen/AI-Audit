import { z } from "zod";

export const createQuestionCategorySchema = z.object({
  formId: z
    .number()
    .int("Form ID must be an integer")
    .positive("Form ID must be a positive integer"),
  name: z
    .string()
    .min(1, "Category name is required")
    .max(255, "Category name must be less than 255 characters")
    .trim(),
  order: z
    .number()
    .int("Order must be an integer")
    .min(0, "Order must be a non-negative integer")
    .default(0),
});

export const updateQuestionCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(255, "Category name must be less than 255 characters")
    .trim()
    .optional(),
  order: z
    .number()
    .int("Order must be an integer")
    .min(0, "Order must be a non-negative integer")
    .optional(),
});

export const questionCategoryParamsSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Invalid question category ID",
    }),
});

export const questionCategoryQuerySchema = z.object({
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
  formId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Form ID must be a positive number",
    })
    .optional(),
  search: z
    .string()
    .max(255, "Search term must be less than 255 characters")
    .optional(),
  sortBy: z.enum(["name", "createdAt", "order"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateQuestionCategory = z.infer<
  typeof createQuestionCategorySchema
>;
export type UpdateQuestionCategory = z.infer<
  typeof updateQuestionCategorySchema
>;
export type QuestionCategoryParams = z.infer<
  typeof questionCategoryParamsSchema
>;
export type QuestionCategoryQuery = z.infer<typeof questionCategoryQuerySchema>;
