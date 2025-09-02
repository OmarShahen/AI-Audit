import { z } from "zod";

export const createQuestionCategorySchema = z.object({
  formId: z
    .number("Form ID is required")
    .int("Form ID must be an integer")
    .positive("Form ID must be a positive integer"),
  name: z
    .string("Category name is required")
    .min(1, "Category name is required")
    .max(255, "Category name must be less than 255 characters")
    .trim(),
  order: z
    .number("Order must be a number")
    .int("Order must be an integer")
    .min(0, "Order must be a non-negative integer")
    .default(0),
});

export const updateQuestionCategorySchema = z.object({
  name: z
    .string("Category name must be a string")
    .min(1, "Category name is required")
    .max(255, "Category name must be less than 255 characters")
    .trim()
    .optional(),
  order: z
    .number("Order must be a number")
    .int("Order must be an integer")
    .min(0, "Order must be a non-negative integer")
    .optional(),
});

export const questionCategoryParamsSchema = z.object({
  id: z
    .string("Question category ID is required")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Invalid question category ID",
    }),
});

export const questionCategoryQuerySchema = z.object({
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
  formId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Form ID must be a positive number",
    })
    .optional(),
  search: z
    .string("Search term must be a string")
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
