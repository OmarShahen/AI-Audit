import { db } from "@/lib/db";
import { submissions, answers, questions, companies, questionCategories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateWordFromText } from "./docx";

export interface QuestionAnswer {
  questionText: string;
  questionOrder: number;
  answers: string[];
}

export interface CategoryData {
  categoryName: string;
  categoryOrder: number;
  questions: Record<number, QuestionAnswer>;
}

export interface SubmissionDocumentData {
  submission: any;
  company: any;
  groupedData: Record<number, CategoryData>;
  totalQuestions: number;
}

export async function getSubmissionData(submissionId: number): Promise<SubmissionDocumentData> {
  // Get submission details
  const [submission] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, submissionId))
    .limit(1);
  
  if (!submission) {
    throw new Error("Submission not found");
  }

  // Get company details
  const [company] = await db
    .select()
    .from(companies)
    .where(eq(companies.id, submission.companyId!))
    .limit(1);

  if (!company) {
    throw new Error("Company not found for this form submission");
  }

  // Get all answers with questions and categories, properly ordered
  const submissionData = await db
    .select({
      questionId: questions.id,
      questionText: questions.text,
      questionOrder: questions.order,
      categoryId: questions.categoryId,
      categoryName: questionCategories.name,
      categoryOrder: questionCategories.order,
      answerValue: answers.value,
    })
    .from(answers)
    .where(eq(answers.submissionId, submissionId))
    .leftJoin(questions, eq(questions.id, answers.questionId))
    .leftJoin(questionCategories, eq(questionCategories.id, questions.categoryId))
    .orderBy(questionCategories.order, questions.order);

  // Group answers by question and category
  const groupedData = submissionData.reduce((acc, row) => {
    const categoryId = row.categoryId!;
    const questionId = row.questionId!;
    
    if (!acc[categoryId]) {
      acc[categoryId] = {
        categoryName: row.categoryName!,
        categoryOrder: row.categoryOrder || 0,
        questions: {}
      };
    }
    
    if (!acc[categoryId].questions[questionId]) {
      acc[categoryId].questions[questionId] = {
        questionText: row.questionText!,
        questionOrder: row.questionOrder || 0,
        answers: []
      };
    }
    
    if (row.answerValue) {
      acc[categoryId].questions[questionId].answers.push(row.answerValue);
    }
    
    return acc;
  }, {} as Record<number, CategoryData>);

  // Calculate total questions
  const totalQuestions = Object.values(groupedData).reduce(
    (total, category) => total + Object.keys(category.questions).length, 
    0
  );

  return {
    submission,
    company,
    groupedData,
    totalQuestions
  };
}

export function generateDocumentContent(data: SubmissionDocumentData): string {
  const { submission, company, groupedData } = data;
  
  let content = `# ${company.name} - Audit Responses\n\n`;
  content += `**Company:** ${company.name}\n`;
  content += `**Industry:** ${company.industry || 'Not specified'}\n`;
  content += `**Size:** ${company.size || 'Not specified'}\n`;
  content += `**Submission Date:** ${new Date(submission.createdAt).toLocaleDateString()}\n\n`;

  // Sort categories by order
  const sortedCategories = Object.entries(groupedData)
    .sort(([, a], [, b]) => a.categoryOrder - b.categoryOrder);

  let questionNumber = 1;

  for (const [categoryId, categoryData] of sortedCategories) {
    content += `## ${categoryData.categoryName}\n\n`;
    
    // Sort questions within category by order
    const sortedQuestions = Object.entries(categoryData.questions)
      .sort(([, a], [, b]) => a.questionOrder - b.questionOrder);

    for (const [questionId, questionData] of sortedQuestions) {
      content += `**${questionNumber}. ${questionData.questionText}**\n\n`;
      
      if (questionData.answers.length > 0) {
        const combinedAnswer = questionData.answers.join(", ");
        content += `${combinedAnswer}\n\n`;
      } else {
        content += `*No response provided*\n\n`;
      }
      
      questionNumber++;
    }
    
    content += `---\n\n`;
  }

  return content;
}

export async function generateQADocument(submissionId: number): Promise<{
  docxBuffer: Buffer;
  fileName: string;
  documentData: SubmissionDocumentData;
}> {
  // Get all the data
  const documentData = await getSubmissionData(submissionId);
  
  // Generate content
  const content = generateDocumentContent(documentData);
  
  // Generate the Word document
  const documentTitle = `${documentData.company.name} - Audit Responses`;
  const docxBuffer = await generateWordFromText(content, documentTitle, "markdown");
  
  // Generate clean filename
  const fileName = `${documentData.company.name.replace(/[^a-zA-Z0-9]/g, '_')}_audit_responses.docx`;
  
  return {
    docxBuffer,
    fileName,
    documentData
  };
}