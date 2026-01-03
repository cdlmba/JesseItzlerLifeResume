/// <reference types="vite/client" />
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnnualPlan, WeeklyWin } from "../types.ts";

const getAI = () => {
  // Use Vite's standard environment standard
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY || '';

  if (!apiKey || apiKey === "undefined") {
    console.error("CRITICAL: Gemini API Key is missing. Make sure VITE_GEMINI_API_KEY is in your .env.local file and you have restarted the dev server.");
  }

  return new GoogleGenerativeAI(apiKey);
};

export const getCoachAdvice = async (plan: AnnualPlan, weeklyHistory: WeeklyWin[], query: string) => {
  try {
    const genAI = getAI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const context = `You are Jesse Itzler, the high-performance coach. 
Plan: ${JSON.stringify(plan)}
Recent Wins: ${JSON.stringify(weeklyHistory)}
User Query: ${query}`;

    const result = await model.generateContent(context);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Coach Error:", error);
    return "Error connecting to the coach. Please check your API key and connection.";
  }
};

export const suggestMisogi = async (interests: string) => {
  try {
    const genAI = getAI();
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `Interests: ${interests}. Suggest ONE Misogi (a 50/50 challenge). Return ONLY a JSON object with this structure: {"title": "string", "description": "string"}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Gemini Misogi Error:", error);
    return { title: "50-Mile Ultra marathon", description: "The ultimate Jesse Itzler challenge: run 50 miles." };
  }
};
