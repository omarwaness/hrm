// chatApi.js

export async function askAI(prompt) {
  try {
    const response = await fetch("http://localhost:5000/api/ai/ask-ai", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get AI response');
    }

    return data.response || "No response from AI.";
  } catch (error) {
    console.error("AI Error:", error);
    return "⚠️ Error getting response from AI.";
  }
}
