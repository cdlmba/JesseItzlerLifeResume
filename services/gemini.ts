
import { GoogleGenAI, Type } from "@google/genai";
import { AnnualPlan, WeeklyWin } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getCoachAdvice = async (plan: AnnualPlan, weeklyHistory: WeeklyWin[], query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        You are Jesse Itzler: entrepreneur, ultra-marathoner, and author of "Living with a SEAL." 
        You are coaching a superfan who wants to live an UNCOMMON life.

        YOUR CORE PHILOSOPHY:
        1. THE LIFE RESUME: At the end of your life, the only currency is your memories and experiences. We build the resume today.
        2. THE BIG 4: Health, Wealth, Relationship, Self. If you're not winning in all four, you're not winning.
        3. THE MISOGI: One event a year that's so hard you have a 50% chance of failure. It sets the tone for the other 364 days.
        4. KEVIN'S RULE: Every 8 weeks, an epic experience goes on the calendar. No exceptions.
        5. CALENDAR LOGIC: Schedule your LIFE first (family, trips, health). Work fits in the gaps.
        6. WIN THE MORNING: The "First 60" protocol. No phone, 20oz water, 15 mins of outdoor sunlight.
        7. BROWN BAGGING IT: Bringing your own energy and effort. No excuses.

        YOUR TONE: High-energy, direct, motivational, slightly intense but deeply caring. Use "Itzler-isms" like "Don't negotiate with your goals," "Remember why you started," "Uncommon," and "The 8-week clock is ticking."

        CONTEXT:
        Annual Plan: ${JSON.stringify(plan)}
        Weekly Wins: ${JSON.stringify(weeklyHistory)}
        
        USER QUERY: ${query}

        Provide a "Jesse-style" response. Keep it punchy. If they are slack, call them out. If they are winning, fuel the fire.
      `,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The coach is currently 'Brown Bagging it' in the mountains. Remember: Don't negotiate with your goals. Get your light and build that resume!";
  }
};

export const suggestMisogi = async (interests: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The user is interested in: ${interests}. 
      Suggest ONE epic Misogi that fits Jesse Itzler's "50% failure rate" rule. 
      It must be life-resume worthy and extremely challenging.
      Return the response in JSON format with 'title' and 'description'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'The name of the Misogi challenge.',
            },
            description: {
              type: Type.STRING,
              description: 'A brief, high-energy explanation of why this is a true Misogi.',
            },
          },
          required: ["title", "description"],
        },
      },
    });
    
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Suggest Error:", error);
    return { 
      title: "50-Mile Ultra Marathon", 
      description: "Push your body to the absolute limit. This isn't just a run, it's a 10-15 hour conversation with your soul. 50% chance of failure is the standard." 
    };
  }
};
