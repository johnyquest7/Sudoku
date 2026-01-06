import { GoogleGenAI, Type } from "@google/genai";
import { BoardGrid, AIHintResponse } from '../types';

export const getAIHint = async (grid: BoardGrid): Promise<AIHintResponse | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });

  // Convert grid to a simple number matrix for the prompt
  const simpleGrid = grid.map(row => row.map(cell => cell.value || 0));
  
  const prompt = `
    You are an expert Sudoku coach. 
    Here is the current state of a Sudoku board (0 represents an empty cell):
    ${JSON.stringify(simpleGrid)}

    Please identify ONE logical next step. Find a cell that can be solved using logic (e.g., Naked Single, Hidden Single, Naked Pair, etc.).
    Do not just give the solution if it's a guess. Look for a definitive move.
    
    Return the result in JSON format with the following schema:
    - row: number (0-8)
    - col: number (0-8)
    - value: number (1-9)
    - explanation: string (A concise, helpful explanation of WHY this number goes here, referencing rows, columns, or blocks).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            row: { type: Type.INTEGER },
            col: { type: Type.INTEGER },
            value: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
          },
          required: ["row", "col", "value", "explanation"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;

    const hintData = JSON.parse(text) as AIHintResponse;
    return hintData;

  } catch (error) {
    console.error("Error fetching AI hint:", error);
    return null;
  }
};
