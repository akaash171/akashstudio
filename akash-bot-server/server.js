require('dotenv').config();

const connectDB = require('./config/database');
connectDB();

const express = require('express');
const Groq = require('groq-sdk');
const axios = require('axios');
const cors = require('cors');

const app = express();

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// Verification Check
// ===============================
console.log('--- Akash Studio System Check ---');

if (process.env.GROQ_API_KEY) {
    console.log('✅ Groq API Key: Loaded');
} else {
    console.log('❌ ERROR: GROQ_API_KEY missing in .env');
}

if (process.env.NEWS_API_KEY) {
    console.log('✅ News API Key: Loaded');
} else {
    console.log('⚠️ WARNING: NEWS_API_KEY missing in .env');
}

if (process.env.EMAIL_USER) {
    console.log('✅ Zoho Mail Configured');
} else {
    console.log('⚠️ Zoho Mail not configured');
}

// ===============================
// Initialize Groq
// ===============================
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// ===============================
// AI System Prompt
// ===============================
const SYSTEM_PROMPT = `
You are the AI Assistant for Akash Studio, an IT & Business Consultancy founded by Akash Mishra.

STRICT INTERACTION RULES:

1. GREETINGS:
If the user starts a conversation, introduce yourself briefly.

2. CONTEXT:
Never repeat the introduction after the first message.

3. SERVICES:
- AI Chatbots
- Full Stack Engineering
- SaaS Audits
- Website Development
- Business Automation
- Zoho Solutions
- WordPress
- GitHub

4. Always answer professionally and accurately.
`;

// ===============================
// Health Check Route
// ===============================
app.get('/', (req, res) => {
    res.json({
        success: true,
        company: "Akash Studio",
        message: "Akash Studio Backend Running Successfully",
        version: "1.0.0"
    });
});

// ===============================
// Live News API
// ===============================
app.get('/api/news', async (req, res) => {
    try {

        const response = await axios.get(
            `https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=${process.env.NEWS_API_KEY}`
        );

        res.json(response.data.articles.slice(0, 5));

    } catch (error) {

        console.error("News API Error:", error.message);

        res.status(500).json({
            error: "Unable to fetch news."
        });

    }
});

// ===============================
// AI Chat Route
// ===============================
app.post('/chat', async (req, res) => {

    try {

        const { history } = req.body;

        const completion = await groq.chat.completions.create({

            model: "llama-3.1-8b-instant",

            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                ...history
            ],

            temperature: 0.5

        });

        res.json({
            reply: completion.choices[0].message.content
        });

    } catch (error) {

        console.error("Groq Error:", error);

        res.status(500).json({
            reply: "I'm having a connection issue. Please contact hello@akashstudio.co.in."
        });

    }

});

// ===============================
// 404 Route
// ===============================
app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API Route Not Found"
    });

});

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("-----------------------------------------");
    console.log("🚀 Akash Studio AI Brain Started");
    console.log(`🌐 Server : http://localhost:${PORT}`);
    console.log("-----------------------------------------");

});