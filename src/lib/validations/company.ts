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

export const companyTypeSchema = z.enum(["partner", "client"]);

export const createCompanySchema = z.object({
  name: z
    .string({ required_error: "Company name is required" })
    .min(1, "Company name is required")
    .max(255, "Company name must be less than 255 characters")
    .trim(),
  formId: z.number({ required_error: "Form ID is required" }).optional(),
  industry: industrySchema,
  size: companySizeSchema,
  website: z
    .string({ required_error: "Website is required" })
    .url("Invalid website URL")
    .max(255, "Website must be less than 255 characters"),
  contactFullName: z
    .string({ required_error: "Contact full name is required" })
    .min(1, "Contact full name is required")
    .max(255, "Contact full name must be less than 255 characters")
    .trim().optional(),
  contactJobTitle: z
    .string()
    .max(255, "Contact job title must be less than 255 characters")
    .optional(),
  contactEmail: z
    .string({ required_error: "Contact email is required" })
    .email("Invalid contact email")
    .max(255, "Contact email must be less than 255 characters"),
  imageURL: z.string({ required_error: "Image URL is required" }).url("Invalid image URL").optional(),
  providerEmail: z.string().email().optional(),
  type: companyTypeSchema,
  partnerId: z.number().optional(),
});

export const updateCompanySchema = z.object({
  name: z
    .string({ required_error: "Company name is required" })
    .min(1, "Company name is required")
    .max(255, "Company name must be less than 255 characters")
    .trim()
    .optional(),
  formId: z.number({ required_error: "Form ID is required" }).optional(),
  industry: industrySchema.optional(),
  size: companySizeSchema.optional(),
  website: z
    .string({ required_error: "Website is required" })
    .url("Invalid website URL")
    .max(255, "Website must be less than 255 characters")
    .optional(),
  contactFullName: z
    .string({ required_error: "Contact full name is required" })
    .min(1, "Contact full name is required")
    .max(255, "Contact full name must be less than 255 characters")
    .trim()
    .optional(),
  contactJobTitle: z
    .string()
    .max(255, "Contact job title must be less than 255 characters")
    .optional(),
  contactEmail: z
    .string({ required_error: "Contact email is required" })
    .email("Invalid contact email")
    .max(255, "Contact email must be less than 255 characters")
    .optional(),
  imageURL: z.string({ required_error: "Image URL is required" }).url("Invalid image URL").optional(),
  providerEmail: z.string().email().optional(),
  type: companyTypeSchema.optional(),
  partnerId: z.number().optional(),
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
  type: companyTypeSchema.optional(),
  partnerId: z.number().optional(),
  search: z
    .string()
    .max(255, "Search term must be less than 255 characters")
    .optional(),
  sortBy: z
    .enum(["name", "createdAt", "industry", "size", "type", "contactFullName"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type Industry = z.infer<typeof industrySchema>;
export type CompanySize = z.infer<typeof companySizeSchema>;
export type CompanyType = z.infer<typeof companyTypeSchema>;
export type CreateCompany = z.infer<typeof createCompanySchema>;
export type UpdateCompany = z.infer<typeof updateCompanySchema>;
export type CompanyParams = z.infer<typeof companyParamsSchema>;
export type CompanyQuery = z.infer<typeof companyQuerySchema>;
