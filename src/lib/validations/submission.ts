import { z } from "zod";

export const createSubmissionSchema = z.object({
  formId: z
    .number("Form ID is required")
    .int("Form ID must be an integer")
    .positive("Form ID must be a positive integer"),
  companyId: z
    .number("Company ID is required")
    .int("Company ID must be an integer")
    .positive("Company ID must be a positive integer"),
});

export const updateSubmissionSchema = z.object({
  formId: z
    .number("Form ID must be a number")
    .int("Form ID must be an integer")
    .positive("Form ID must be a positive integer")
    .optional(),
  companyId: z
    .number("Company ID must be a number")
    .int("Company ID must be an integer")
    .positive("Company ID must be a positive integer")
    .optional(),
});

export const submissionParamsSchema = z.object({
  id: z
    .string("Submission ID is required")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Invalid submission ID",
    }),
});

export const submissionQuerySchema = z.object({
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
  companyId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Company ID must be a positive number",
    })
    .optional(),
  sortBy: z
    .enum(["createdAt"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateSubmission = z.infer<typeof createSubmissionSchema>;
export type UpdateSubmission = z.infer<typeof updateSubmissionSchema>;
export type SubmissionParams = z.infer<typeof submissionParamsSchema>;
export type SubmissionQuery = z.infer<typeof submissionQuerySchema>;