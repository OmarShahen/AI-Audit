import { z } from "zod";

export const createFormSchema = z.object({
  title: z
    .string("Form title is required")
    .min(1, "Form title is required")
    .max(255, "Form title must be less than 255 characters")
    .trim(),
  description: z
    .string("Form description is required")
    .min(1, "Form description is required")
    .trim(),
});

export const updateFormSchema = z.object({
  title: z
    .string("Form title must be a string")
    .min(1, "Form title is required")
    .max(255, "Form title must be less than 255 characters")
    .trim()
    .optional(),
  description: z
    .string("Form description must be a string")
    .min(1, "Form description is required")
    .trim()
    .optional(),
});

export const formParamsSchema = z.object({
  id: z
    .string("Form ID is required")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Invalid form ID",
    }),
});

export const formQuerySchema = z.object({
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
  search: z
    .string("Search term must be a string")
    .max(255, "Search term must be less than 255 characters")
    .optional(),
  sortBy: z
    .enum(["title", "createdAt"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateForm = z.infer<typeof createFormSchema>;
export type UpdateForm = z.infer<typeof updateFormSchema>;
export type FormParams = z.infer<typeof formParamsSchema>;
export type FormQuery = z.infer<typeof formQuerySchema>;