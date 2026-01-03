import { GoogleGenAI, Type } from "@google/genai";
import { AnnualPlan, WeeklyWin } from "../types.ts";

const getAI = () => {
  const apiKey = (window as any).process?.env?.API_KEY || '';
  return new GoogleGenAI({ apiKey });
};

export const getCoachAdvice = async (plan: AnnualPlan, weeklyHistory: WeeklyWin[], query: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are Jesse Itzler. Context: Plan: ${JSON.stringify(plan)}, Wins: ${JSON.stringify(weeklyHistory)}. User: ${query}`,
    });
    return response.text || "Error getting advice.";
  } catch (error) {
    console.error(error);
    return "Error connecting to the coach.";
  }
};

export const suggestMisogi = async (interests: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Interests: ${interests}. Suggest ONE Misogi. Return JSON {title, description}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ["title", "description"],
        },
      },
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error(error);
    return { title: "50-Mile Ultra", description: "The ultimate challenge." };
  }
};
