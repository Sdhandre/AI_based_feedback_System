
const express = require("express");
const axios = require("axios");
const Review = require("../models/review");
const router = express.Router();

async function callLLM(prompt) {
  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "meta-llama/llama-3.1-8b-instruct",
      messages: [{ role: "user", content: prompt }]
    },
    {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return res.data.choices[0].message.content;
}

// POST — USER SUBMISSION
router.post("/", async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || !review.trim()) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const prompt = `
User wrote a review and rating.

Review: ${review}
Rating: ${rating}

1. Reply politely to the user.
2. Summarise issue.
3. Suggest next action for business.

Return JSON:

{
 "aiUserMessage": "...",
 "aiSummary": "...",
 "aiRecommendation": "..."
}
`;

    let ai = await callLLM(prompt);

    function extractJson(text) {
  try {
    // Try direct parse first
    return JSON.parse(text);
  } catch (e) {}

  // Try extracting JSON inside code block
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    return JSON.parse(match[0]);
  }

  throw new Error("No valid JSON in LLM response");
}

const json = extractJson(ai);


    const newReview = await Review.create({
      rating,
      review,
      aiUserMessage: json.aiUserMessage,
      aiSummary: json.aiSummary,
      aiRecommendation: json.aiRecommendation
    });

    res.json({
      success: true,
      aiUserMessage: json.aiUserMessage
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "AI or server error"
    });
  }
});

// GET — ADMIN LIST VIEW
router.get("/", async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
});

module.exports = router;
