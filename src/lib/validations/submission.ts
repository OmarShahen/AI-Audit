import { z } from "zod";
import { db } from "@/lib/db";
import { companies, questions } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";

export const createSubmissionSchema = z.object({
  formId: z
    .number()
    .int("Form ID must be an integer")
    .positive("Form ID must be a positive integer"),
  companyId: z
    .number()
    .int("Company ID must be an integer")
    .positive("Company ID must be a positive integer"),
});

export const updateSubmissionSchema = z.object({
  formId: z
    .number()
    .int("Form ID must be an integer")
    .positive("Form ID must be a positive integer")
    .optional(),
  companyId: z
    .number()
    .int("Company ID must be an integer")
    .positive("Company ID must be a positive integer")
    .optional(),
});

export const submissionParamsSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Invalid submission ID",
    }),
});

export const submissionQuerySchema = z.object({
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
  companyId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Company ID must be a positive number",
    })
    .optional(),
  sortBy: z.enum(["createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Enhanced schema for complete form submission
export const completeSubmissionSchema = z.object({
  companyId: z.number({ required_error: 'Company ID is required' }),
  formId: z.number({ required_error: 'Form ID is required' }),
  formData: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
});

// Schema for validating form data answers
export const formAnswerSchema = z.object({
  questionId: z.number().positive("Question ID must be positive"),
  value: z.string().min(1, "Answer value cannot be empty"),
});

// Validation functions
export async function validateCompanyExists(companyName: string) {
  const company = await db.query.companies.findFirst({
    where: eq(companies.name, companyName),
  });

  if (!company) {
    throw new Error("Company not found");
  }

  return company;
}

export async function validateAndProcessFormData(
  formData: Record<string, string | string[]>,
  formId: number
) {
  // Extract question IDs from form data
  const questionIds = [];
  for (const fieldKey of Object.keys(formData)) {
    const questionIdMatch = fieldKey.match(/^question_(\d+)$/);
    if (questionIdMatch) {
      questionIds.push(parseInt(questionIdMatch[1]));
    }
  }

  if (questionIds.length === 0) {
    throw new Error("No valid questions found in form data");
  }

  // Fetch and validate questions belong to the correct form
  const relevantQuestions = await db.query.questions.findMany({
    where: inArray(questions.id, questionIds),
    with: {
      category: {
        columns: { formId: true },
      },
    },
  });

  // Filter questions to ensure they belong to the correct form
  const validQuestions = relevantQuestions.filter(
    (q) => q.category.formId === formId
  );
  const validQuestionIds = new Set(validQuestions.map((q) => q.id));

  // Process and validate answers
  const validatedAnswers = [];
  const invalidQuestionIds = [];

  for (const [fieldKey, value] of Object.entries(formData)) {
    const questionIdMatch = fieldKey.match(/^question_(\d+)$/);
    if (questionIdMatch) {
      const questionId = parseInt(questionIdMatch[1]);

      if (validQuestionIds.has(questionId)) {
        if (Array.isArray(value)) {
          // For checkbox/multi-select questions - create separate answer for each value
          for (const singleValue of value) {
            if (singleValue && String(singleValue).trim() !== "") {
              validatedAnswers.push({
                questionId,
                value: String(singleValue).trim(),
              });
            }
          }
        } else if (typeof value === "string" && value.trim() !== "") {
          // For text/textarea/radio questions
          validatedAnswers.push({
            questionId,
            value: value.trim(),
          });
        } else if (value !== null && value !== undefined) {
          // Convert other types to string
          const stringValue = String(value).trim();
          if (stringValue !== "") {
            validatedAnswers.push({
              questionId,
              value: stringValue,
            });
          }
        }
      } else {
        invalidQuestionIds.push(questionId);
      }
    }
  }

  // Log warnings for invalid question IDs
  if (invalidQuestionIds.length > 0) {
    console.warn(
      `Invalid question IDs found for form ${formId}:`,
      invalidQuestionIds
    );
  }

  // Create questions with answers list - group by question ID
  const questionAnswersMap = new Map<
    number,
    {
      questionId: number;
      questionText: string;
      questionType: string;
      answers: string[];
      rawValue: string | string[];
    }
  >();

  for (const answer of validatedAnswers) {
    const question = validQuestions.find((q) => q.id === answer.questionId);
    if (question) {
      // Find the raw value from form data
      const fieldKey = `question_${answer.questionId}`;
      const rawValue = formData[fieldKey];

      if (!questionAnswersMap.has(answer.questionId)) {
        questionAnswersMap.set(answer.questionId, {
          questionId: answer.questionId,
          questionText: question.text,
          questionType: question.type,
          answers: [],
          rawValue: rawValue,
        });
      }

      questionAnswersMap.get(answer.questionId)!.answers.push(answer.value);
    }
  }

  const questionsWithAnswers = Array.from(questionAnswersMap.values());

  return {
    validatedAnswers,
    questionsWithAnswers,
    totalQuestionsSubmitted: questionIds.length,
    validQuestionsCount: validQuestions.length,
    invalidQuestionIds,
  };
}

export type CreateSubmission = z.infer<typeof createSubmissionSchema>;
export type UpdateSubmission = z.infer<typeof updateSubmissionSchema>;
export type SubmissionParams = z.infer<typeof submissionParamsSchema>;
export type SubmissionQuery = z.infer<typeof submissionQuerySchema>;
export type CompleteSubmission = z.infer<typeof completeSubmissionSchema>;
export type FormAnswer = z.infer<typeof formAnswerSchema>;
