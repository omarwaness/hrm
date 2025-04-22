const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyBEdJUO5M50GJpKXxrLkPTSPTf3XnbghDE"; // Use environment variable in production
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// POST /ask-ai
router.post("/ask-ai", async (req, res) => {
  const userPrompt = req.body.prompt;

  try {
    const result = await model.generateContent(userPrompt);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

module.exports = router;
