import { z } from "zod";

export const industrySchema = z.enum([
  "technology",
  "healthcare",
  "finance",
  "education",
  "manufacturing",
  "retail",
  "hospitality",
  "construction",
  "real_estate",
  "transportation",
  "logistics",
  "agriculture",
  "media",
  "professional_services",
  "non_profit",
  "other",
]);

export const companySizeSchema = z.enum([
  "startup",
  "small",
  "medium",
  "large",
  "enterprise",
]);

export const createCompanySchema = z.object({
  name: z
    .string()
    .min(1, "Company name is required")
    .max(255, "Company name must be less than 255 characters")
    .trim(),
  formId: z.number(),
  industry: industrySchema,
  size: companySizeSchema,
  imageURL: z.string().url("Invalid image URL"),
  providerEmail: z.string().email().optional(),
});

export const updateCompanySchema = z.object({
  name: z
    .string()
    .min(1, "Company name is required")
    .max(255, "Company name must be less than 255 characters")
    .trim()
    .optional(),
  formId: z.number().optional(),
  industry: industrySchema.optional(),
  size: companySizeSchema.optional(),
  imageURL: z.string().url("Invalid image URL").optional(),
  providerEmail: z.string().email().optional(),
});

export const companyParamsSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Invalid company ID",
    }),
});

export const companyQuerySchema = z.object({
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
  industry: industrySchema.optional(),
  size: companySizeSchema.optional(),
  search: z
    .string()
    .max(255, "Search term must be less than 255 characters")
    .optional(),
  sortBy: z
    .enum(["name", "createdAt", "industry", "size"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type Industry = z.infer<typeof industrySchema>;
export type CompanySize = z.infer<typeof companySizeSchema>;
export type CreateCompany = z.infer<typeof createCompanySchema>;
export type UpdateCompany = z.infer<typeof updateCompanySchema>;
export type CompanyParams = z.infer<typeof companyParamsSchema>;
export type CompanyQuery = z.infer<typeof companyQuerySchema>;
