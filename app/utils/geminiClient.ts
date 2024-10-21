import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("Missing Gemini API Key");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function generateBio(name: string, jobTitle: string, skills: string): Promise<string> {
  const prompt = `Generate a professional bio for a person named ${name}, who works as a ${jobTitle}. Their key skills include ${skills}. The bio should be concise, engaging, and suitable for a vCard or professional profile. Limit the response to 2-3 sentences.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

