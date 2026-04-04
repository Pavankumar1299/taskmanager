import { GoogleGenAI, Type } from "@google/genai";
// import { Task, Priority, Status } from "../types";
import { format, addDays } from "date-fns";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

const taskSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A concise and clear title for the task.",
    },
    description: {
      type: Type.STRING,
      description: "A detailed description of what needs to be done.",
    },
    priority: {
      type: Type.STRING,
      enum: ["low", "medium", "high"],
      description: "The priority level of the task.",
    },
    daysFromNow: {
      type: Type.INTEGER,
      description: "Number of days from today when this task should be due (0-30).",
    },
  },
  required: ["title", "description", "priority", "daysFromNow"],
};

export async function generateTask(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      // 👇 THIS IS THE NEW UPGRADED PROMPT 👇
      contents: `You are an expert Agile Project Manager. 
      The user will give you a rough idea for a task. 
      Your job is to expand that idea into a professional, actionable task ticket.
      
      User Idea: "${prompt}"
      
      Rules for your JSON response:
      1. title: Make it short, action-oriented, and clear (e.g., "Implement JWT Authentication" instead of "do login").
      2. description: Write 2-3 sentences explaining exactly what needs to be done, the expected outcome, and why it matters.
      3. priority: Analyze the urgency of the user's idea and strictly assign "low", "medium", or "high". 
      4. daysFromNow: Estimate how many days this specific task should realistically take to complete (between 1 and 14).`,
      // 👆 END OF NEW PROMPT 👆
      config: {
        responseMimeType: "application/json",
        responseSchema: taskSchema,
      },
    });

    const result = JSON.parse(response.text || "{}");
    
    return {
      title: result.title || "New Task",
      description: result.description || "",
      priority: (result.priority || "medium").toUpperCase(),
      dueDate: format(addDays(new Date(), result.daysFromNow || 1), "yyyy-MM-dd"),
    };
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate task with AI. Please try again.");
  }
}
