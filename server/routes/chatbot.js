const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Define a POST route for handling chatbot request
router.post("/", async (req, res) => {
    try {
        const { message } = req.body;

        // Make a request to the Groq API for generating a chatbot response
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions", // Groq API endpoint
            {
                model: "llama3-8b-8192",
                messages: [{ role: "user", content: message }],
            },
            {
                headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
            }
        );
        // Send AI-generated response back to the client
        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Groq API Error:", error);
        res.status(500).json({ error: "AI response failed" });
    }
});

module.exports = router;
