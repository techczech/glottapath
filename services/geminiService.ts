

import { GoogleGenAI, Type } from "@google/genai";
import { Exercise, ExerciseType } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || " " });

const exerciseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A short, descriptive title for the exercise." },
    type: {
      type: Type.STRING,
      enum: [
        ExerciseType.CLOZE,
        ExerciseType.MULTIPLE_CHOICE,
        ExerciseType.ESSAY,
        ExerciseType.ORDERING,
      ],
      description: "The type of exercise."
    },
    instructions: { type: Type.STRING, description: "Clear instructions for the student." },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Relevant tags for grammar, theme, difficulty (e.g., 'past-tense', 'shopping', 'A2')."
    },
    // Cloze specific
// FIX: Removed nullable: true as it is not a supported property in the response schema. Properties are made optional by not including them in the 'required' array.
    content: { type: Type.STRING, description: "For CLOZE exercises, the sentence with placeholders like __BLANK_0__." },
    blanks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          correctAnswer: { type: Type.STRING },
// FIX: Removed nullable: true as it is not a supported property in the response schema. Properties are made optional by not including them in the 'required' array.
          hint: { type: Type.STRING }
        },
        required: ['correctAnswer']
      },
// FIX: Removed nullable: true as it is not a supported property in the response schema. Properties are made optional by not including them in the 'required' array.
    },
    // Multiple choice specific
// FIX: Removed nullable: true as it is not a supported property in the response schema. Properties are made optional by not including them in the 'required' array.
    question: { type: Type.STRING, description: "For MULTIPLE_CHOICE, the main question." },
    options: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          isCorrect: { type: Type.BOOLEAN },
// FIX: Removed nullable: true as it is not a supported property in the response schema. Properties are made optional by not including them in the 'required' array.
          hint: { type: Type.STRING }
        },
        required: ['text', 'isCorrect']
      },
// FIX: Removed nullable: true as it is not a supported property in the response schema. Properties are made optional by not including them in the 'required' array.
    },
    // Essay specific
// FIX: Removed nullable: true as it is not a supported property in the response schema. Properties are made optional by not including them in the 'required' array.
    prompt: { type: Type.STRING, description: "For ESSAY, the writing prompt." },
// FIX: Removed nullable: true as it is not a supported property in the response schema. Properties are made optional by not including them in the 'required' array.
    wordCount: { type: Type.INTEGER, description: "Suggested word count for an ESSAY." },
    // Ordering specific
    items: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                text: { type: Type.STRING },
                correctOrder: { type: Type.INTEGER }
            },
            required: ['text', 'correctOrder']
        },
// FIX: Removed nullable: true as it is not a supported property in the response schema. Properties are made optional by not including them in the 'required' array.
    }
  },
  required: ['title', 'type', 'instructions', 'tags']
};

export const generateExerciseFromPrompt = async (prompt: string): Promise<Exercise> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a language learning exercise based on this prompt: "${prompt}". Ensure the output strictly follows the provided JSON schema. For CLOZE exercises, use placeholders like __BLANK_0__, __BLANK_1__ etc in the content field.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: exerciseSchema,
        systemInstruction: "You are an expert language teacher creating educational materials. Your output must be a single, valid JSON object matching the provided schema. Do not include any markdown formatting like ```json ... ```."
      }
    });

    const jsonString = response.text.trim();
    const generatedExercise = JSON.parse(jsonString) as Omit<Exercise, 'id'>;

    return {
      ...generatedExercise,
      id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    } as Exercise;
  } catch (error) {
    console.error("Error generating exercise with Gemini:", error);
    throw new Error("Failed to generate exercise. Please check your prompt and API key.");
  }
};
