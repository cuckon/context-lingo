import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize Gemini Client
// API Key is injected via environment variable process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-3-flash-preview";

export const translateParagraph = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Translate the following English paragraph into natural, fluent Chinese. 
      Capture the nuance and tone (e.g., informal, corporate, sarcastic).
      Do not add any preamble or markdown code blocks, just return the raw text string.
      
      Paragraph:
      """
      ${text}
      """`,
      config: {
        thinkingConfig: { thinkingBudget: 100 },
      },
    });

    return response.text || "Translation failed.";
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
};

export const analyzeWordInContext = async (
  fullParagraph: string,
  targetWord: string
): Promise<AnalysisResult> => {
  try {
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        wordInContext: {
          type: Type.STRING,
          description: "The specific meaning of the clicked word in this context (Chinese).",
        },
        phraseDetected: {
          type: Type.STRING,
          description: "If the word is part of a phrase/idiom (e.g., 'float an idea', 'shoot out back'), return the full English phrase. If literal/standalone, return null.",
          nullable: true,
        },
        phraseExplanation: {
          type: Type.STRING,
          description: "Explanation of the detected phrase in Chinese. Null if no phrase detected.",
          nullable: true,
        },
        sentence: {
          type: Type.STRING,
          description: "The complete English sentence containing the target word.",
        },
        sentenceTranslation: {
          type: Type.STRING,
          description: "Fluent Chinese translation of that specific sentence.",
        },
        nuance: {
          type: Type.STRING,
          description: "Notes on tone, formality, or hidden meaning (Chinese).",
        },
      },
      required: ["wordInContext", "sentence", "sentenceTranslation", "nuance"],
    };

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `You are an expert English tutor. Analyze the word "${targetWord}" found in the context of the following paragraph.
      
      Paragraph:
      """
      ${fullParagraph}
      """
      
      Goal: Explain to a Chinese student what this word means *specifically in this context*.
      If it is part of an idiom, phrasal verb, or slang (e.g. "float" in "float an idea", or "shoot" in "shoot it out back"), identify that phrase.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        thinkingConfig: { thinkingBudget: 100 },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned from Gemini");

    return JSON.parse(jsonText) as AnalysisResult;
  } catch (error) {
    console.error("Analysis error:", error);
    throw error;
  }
};
