import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const roles = {
  doctor: "You are a professional doctor. Give safe and general medical advice.",
  lawyer: "You are a legal expert. Provide legal insights clearly.",
  engineer: "You are a skilled engineer. Solve technical problems step by step.",
  teacher: "You are a teacher. Explain concepts simply.",
  student: "You are a helpful study assistant.",
  default: "You are a helpful AI assistant."
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, role } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "Missing OPENAI_API_KEY environment variable"
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
      return res.status(500).json({ error: "No response from AI provider" });
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "Failed to process chat request" });
  }
}
