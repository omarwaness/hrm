// chatApi.js
import axios from "axios";

export async function askAI(prompt) {
  try {
    const response = await axios.post("http://localhost:5000/api/ai/ask-ai", {
      prompt,
    });

    return response.data.response || "No response from AI.";
  } catch (error) {
    console.error("AI Error:", error);
    return "⚠️ Error getting response from AI.";
  }
}
