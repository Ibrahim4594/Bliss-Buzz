import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMeditationSessionSchema, insertMoodRecordSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate AI-powered meditation script
  app.post("/api/meditation/generate", async (req, res) => {
    try {
      const { mood, duration } = req.body;

      if (!mood || !duration) {
        return res.status(400).json({ error: "Mood and duration are required" });
      }

      const moodPrompts: Record<string, string> = {
        anxious: "You are feeling anxious with racing thoughts and worry. Create a calming meditation focused on grounding, breath awareness, and releasing anxiety.",
        stressed: "You are feeling stressed and tense. Create a meditation that releases tension, promotes relaxation, and brings mental clarity.",
        overwhelmed: "You are feeling overwhelmed with too much to handle. Create a meditation that provides perspective, simplifies thoughts, and restores calm.",
        restless: "You are feeling restless and unable to settle. Create a meditation that channels energy productively, promotes focus, and brings inner stillness.",
        tired: "You are feeling exhausted and drained. Create a gentle meditation that restores energy, rejuvenates the spirit, and promotes mindful rest.",
        peaceful: "You are already feeling peaceful. Create a meditation that deepens this serenity, cultivates gratitude, and enhances inner joy.",
      };

      const systemPrompt = `You are a compassionate meditation guide creating personalized guided meditation scripts. 
Your scripts should be:
- Warm, calming, and deeply empathetic
- Written in second person ("you")
- ${duration} minutes long (approximately ${duration * 150} words)
- Include gentle breathing cues
- Focus on the present moment
- End with a peaceful transition back to awareness

${moodPrompts[mood] || moodPrompts.peaceful}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Create a ${duration}-minute guided meditation for someone feeling ${mood}.`,
          },
        ],
        temperature: 0.8,
        max_tokens: 1000,
      });

      const script = completion.choices[0]?.message?.content || "Take a deep breath and find your center.";

      res.json({ script });
    } catch (error) {
      console.error("Error generating meditation:", error);
      res.status(500).json({ error: "Failed to generate meditation" });
    }
  });

  // Get all meditation sessions
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error getting sessions:", error);
      res.status(500).json({ error: "Failed to get sessions" });
    }
  });

  // Save a completed meditation session
  app.post("/api/sessions", async (req, res) => {
    try {
      const validatedData = insertMeditationSessionSchema.parse(req.body);
      const session = await storage.createSession(validatedData);
      res.json(session);
    } catch (error) {
      console.error("Error saving session:", error);
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  // Save mood record
  app.post("/api/mood", async (req, res) => {
    try {
      const validatedData = insertMoodRecordSchema.parse(req.body);
      const moodRecord = await storage.createMoodRecord(validatedData);
      res.json(moodRecord);
    } catch (error) {
      console.error("Error saving mood:", error);
      res.status(400).json({ error: "Invalid mood data" });
    }
  });

  // Get user statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error getting stats:", error);
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
