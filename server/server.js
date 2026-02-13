require('dotenv').config(); // חייב להיות ראשון!
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, "cvData.json");

// בדיקה אם המפתח קיים בזיכרון לפני שמפעילים את OpenAI
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Error: OPENAI_API_KEY is missing in .env file!");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

// --- פונקציות עזר ---
const readData = () => {
  if (!fs.existsSync(DATA_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE));
  } catch (e) { return {}; }
};

const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// --- Routes ---
app.get("/api/cv", (req, res) => res.json(readData()));
app.post("/api/cv/save", (req, res) => {
  writeData(req.body);
  res.json({ status: "success" });
});

app.post("/api/improve-experience", async (req, res) => {
  const { role, description } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a professional CV writer. Rewrite in Hebrew." },
        { role: "user", content: `Role: ${role}, Description: ${description}` }
      ],
    });
    res.json({ improvedText: completion.choices[0].message.content });
  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("🚀 Server is alive on http://localhost:3000"));