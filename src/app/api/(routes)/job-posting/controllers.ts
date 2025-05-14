import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  geminiAnalyzeSystemPrompt,
  geminiAnalyzeFellowPrompt,
} from "../../(constants)/gemini";
import { jobPostingAiResultSchema, JobPostingAiResultType } from "./validators";

export const getGeminiPredictResult = async (
  title: string,
  jobDescription: string,
  cvText: string,
  aiKey: string
): Promise<[JobPostingAiResultType, string]> => {
  const genAI = new GoogleGenerativeAI(aiKey);
  const geminiPredictModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: geminiAnalyzeSystemPrompt,
  });

  const result = await geminiPredictModel.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: geminiAnalyzeFellowPrompt({ cvText, jobDescription, title }),
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0,
    },
  });

  const aiResult = result.response.text().replace(/^```\w*\n?|```$/g, "");
  const aiResultObject = JSON.parse(aiResult);

  return [jobPostingAiResultSchema.parse(aiResultObject), "gemini-2.0-flash"];
};
