import { openai } from "../openai";

interface UserAnswers {
  question: string;
  answer: string;
}

interface GenerateReport {
  instructions: string;
  userAnswers: UserAnswers[];
}

export const generateReport = async (reportData: GenerateReport) => {
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
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
