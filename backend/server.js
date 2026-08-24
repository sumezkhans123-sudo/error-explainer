const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// AI error explanation
app.post("/generate", async (req, res) => {
  try {
    const { error } = req.body;

    if (!error || !error.trim()) {
      return res.status(400).json({
        error: "Please provide a programming error to explain.",
      });
    }

    const prompt = `
You are a helpful programming tutor.

A developer has encountered this programming error:

${error}

Explain this error in beginner-friendly language.

Your response must contain these four sections:

1. What This Error Means
Explain what the error is saying in simple terms.

2. Likely Cause
Explain the most likely reason this error happened.

3. How to Fix It
Give practical steps the developer can try.

4. What to Check Next
Give one or more things the developer should inspect if the problem continues.

Do not pretend to know information that was not provided.
If the error alone is not enough to determine the exact cause, clearly say that.
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const explanation = response.data.choices[0].message.content;

    res.json({
      explanation,
    });
  } catch (error) {
    console.error(
      "AI request failed:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Something went wrong while generating the explanation.",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});