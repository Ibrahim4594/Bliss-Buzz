import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Mood types for emotional intelligence
export type MoodType = "anxious" | "stressed" | "overwhelmed" | "restless" | "tired" | "peaceful";

// Meditation session table
export const meditationSessions = pgTable("meditation_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mood: text("mood").notNull(),
  duration: integer("duration").notNull(), // in minutes
  script: text("script").notNull(), // AI-generated meditation script
  environment: text("environment").notNull(), // bamboo, ocean, aurora, temple
  completedAt: timestamp("completed_at").defaultNow(),
});

// Mood records for tracking emotional patterns
export const moodRecords = pgTable("mood_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mood: text("mood").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// User statistics for dashboard
export const userStats = pgTable("user_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalSessions: integer("total_sessions").default(0),
  totalMinutes: integer("total_minutes").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  meditationLevel: text("meditation_level").default("Beginner"), // Beginner, Intermediate, Advanced, Master
});

// Zod schemas for validation
export const insertMeditationSessionSchema = createInsertSchema(meditationSessions).omit({
  id: true,
  completedAt: true,
});

export const insertMoodRecordSchema = createInsertSchema(moodRecords).omit({
  id: true,
  timestamp: true,
});

// Types
export type InsertMeditationSession = z.infer<typeof insertMeditationSessionSchema>;
export type MeditationSession = typeof meditationSessions.$inferSelect;

export type InsertMoodRecord = z.infer<typeof insertMoodRecordSchema>;
export type MoodRecord = typeof moodRecords.$inferSelect;

export type UserStats = typeof userStats.$inferSelect;

// Meditation level types
export type MeditationLevel = "Beginner" | "Intermediate" | "Advanced" | "Master";

// Level thresholds and milestones
export const levelThresholds = {
  Beginner: { minSessions: 0, minMinutes: 0, minStreak: 0 },
  Intermediate: { minSessions: 10, minMinutes: 50, minStreak: 3 },
  Advanced: { minSessions: 30, minMinutes: 200, minStreak: 7 },
  Master: { minSessions: 100, minMinutes: 500, minStreak: 14 },
} as const;

// Zen Sparks (pre-defined quick meditation prompts)
export const zenSparks = [
  {
    id: "1",
    title: "Quick Calm",
    duration: 2,
    mood: "stressed",
    description: "2-minute emergency calm for overwhelming moments",
  },
  {
    id: "2", 
    title: "Breath Reset",
    duration: 3,
    mood: "anxious",
    description: "3-minute breathing exercise to center yourself",
  },
  {
    id: "3",
    title: "Energy Boost",
    duration: 5,
    mood: "tired",
    description: "5-minute mindful awakening session",
  },
  {
    id: "4",
    title: "Focus Flow",
    duration: 5,
    mood: "restless",
    description: "5-minute concentration enhancer",
  },
  {
    id: "5",
    title: "Stress Release",
    duration: 3,
    mood: "overwhelmed",
    description: "3-minute tension release practice",
  },
  {
    id: "6",
    title: "Deep Peace",
    duration: 5,
    mood: "peaceful",
    description: "5-minute gratitude and serenity",
  },
] as const;

// Environment options
export const environments = [
  { id: "bamboo", name: "Bamboo Forest", description: "Tranquil green sanctuary" },
  { id: "ocean", name: "Ocean Depths", description: "Bioluminescent calm" },
  { id: "aurora", name: "Aurora Sky", description: "Arctic serenity" },
  { id: "temple", name: "Temple Garden", description: "Sacred peace" },
] as const;
