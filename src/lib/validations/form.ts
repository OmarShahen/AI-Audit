import { z } from "zod";

export const createFormSchema = z.object({
  title: z
    .string()
    .min(1, "Form title is required")
    .max(255, "Form title must be less than 255 characters")
    .trim(),
  description: z.string().min(1, "Form description is required").trim(),
});

export const updateFormSchema = z.object({
  title: z
    .string()
    .min(1, "Form title is required")
    .max(255, "Form title must be less than 255 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .min(1, "Form description is required")
    .trim()
    .optional(),
});

export const formParamsSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Invalid form ID",
    }),
});

export const formQuerySchema = z.object({
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
  search: z
    .string()
    .max(255, "Search term must be less than 255 characters")
    .optional(),
  sortBy: z.enum(["title", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateForm = z.infer<typeof createFormSchema>;
export type UpdateForm = z.infer<typeof updateFormSchema>;
export type FormParams = z.infer<typeof formParamsSchema>;
export type FormQuery = z.infer<typeof formQuerySchema>;
