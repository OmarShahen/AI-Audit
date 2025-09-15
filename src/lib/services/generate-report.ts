import { openai } from "../openai";

interface UserAnswers {
  question: string;
  answer: string;
}

interface GenerateReport {
  instructions: string;
  userAnswers: UserAnswers[];
  model?: string;
}

export const generateReport = async (reportData: GenerateReport) => {
  const response = await openai.responses.create({
    model: reportData.model || "gpt-5",
    input: [
      {
        role: "system",
        content: reportData.instructions,
      },
      {
        role: "user",
        content: JSON.stringify(reportData.userAnswers, null, 2),
      },
    ],
  });

  return response.output_text;
};
