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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const context = `You are Jesse Itzler, the high-performance coach. 
The user's theme for the year is: "${plan.theme}". 
Your advice MUST align with and reinforce this specific theme.

CORE PHILOSOPHY:
1. THE LIFE RESUME: We don't just live for work. We live to build a resume of unique stories and experiences.
2. LIFE COMPRESSION: Routine causes life to blur. When no new memories are made, time "compresses" and years fly by.
3. MEMORY ANCHORS: Kevin's Rule (one experience every 8 weeks) and Misogi (one 50/50 challenge/year) are the antidotes. They "stretch" time by creating distinct milestones.
4. NO NEGOTIATION: Once it's on the calendar, the debate is over.

Plan Details: ${JSON.stringify(plan)}
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

export const suggestMisogi = async (interests: string, theme: string) => {
  try {
    const genAI = getAI();
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `Theme for the year: ${theme}. 
Interests: ${interests}. 

Suggest ONE Misogi (a 50/50 challenge) that fits BOTH the interests and pushes the boundaries of the "Annual Theme". 
Return ONLY a JSON object with this structure: {"title": "string", "description": "string"}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Gemini Misogi Error:", error);
    return { title: "50-Mile Ultra marathon", description: "The ultimate Jesse Itzler challenge: run 50 miles." };
  }
};

export const suggestKevinRule = async (interests: string, theme: string) => {
  try {
    const genAI = getAI();
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `Theme for the year: ${theme}. 
Interests: ${interests}. 

PHILOSOPHY: Suggest ONE "Kevin's Rule" event. This is a "mini-adventure" or "memory anchor" to prevent "Life Compression" (the blur of routine). 
The goal is to stretch time by inserting a unique story into the 8-week block.

EXPERIENCE CATEGORIES (Randomly pick one style for variety):
- Low/No Cost: City tourist days, backyard camping, 24hr digital detox.
- Mid-Range: Road trip to a new town, niche workshops (archery, glass-blowing), weird theater.
- High-End: Helicopter tours, spa retreats, flying to a major sporting event.

The suggestion should be significant enough to stand out in a memory, but smaller than a full year-defining Misogi.

Return ONLY a JSON object: {"title": "string", "description": "string"}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Gemini Kevin's Rule Error:", error);
    return { title: "Weekend Adventure Study", description: "Pick a topic you know nothing about and spend 48 hours learning it deeply." };
  }
};
