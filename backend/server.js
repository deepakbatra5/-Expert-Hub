import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.join(__dirname, "..", "frontend");

app.use(cors());
app.use(express.json());
app.use(express.static(frontendDir));

const PORT = process.env.PORT || 3000;

// Role-based system prompts
const roles = {
  doctor: "You are a professional doctor. Give safe and general medical advice.",
  lawyer: "You are a legal expert. Provide legal insights clearly.",
  engineer: "You are a skilled engineer. Solve technical problems step by step.",
  teacher: "You are a teacher. Explain concepts simply.",
  student: "You are a helpful study assistant.",
  default: "You are a helpful AI assistant."
};

app.post("/chat", async (req, res) => {
  const { message, role } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "Missing OPENAI_API_KEY. Add it in your .env file and restart the server."
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: roles[role] || roles.default },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      return res.status(500).json({ error: "No response returned from AI provider." });
    }

    res.json({ reply });

  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Expert Hub running on http://localhost:${PORT}`);
});