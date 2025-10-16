import {
  type MeditationSession,
  type InsertMeditationSession,
  type MoodRecord,
  type InsertMoodRecord,
  type UserStats,
  type MeditationLevel,
  levelThresholds,
  meditationSessions,
  moodRecords,
  userStats,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Meditation sessions
  createSession(session: InsertMeditationSession): Promise<MeditationSession>;
  getSessions(): Promise<MeditationSession[]>;
  
  // Mood tracking
  createMoodRecord(mood: InsertMoodRecord): Promise<MoodRecord>;
  getMoodRecords(): Promise<MoodRecord[]>;
  
  // User statistics
  getStats(): Promise<UserStats>;
  updateStats(sessions: MeditationSession[]): Promise<UserStats>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, MeditationSession>;
  private moodRecords: Map<string, MoodRecord>;
  private stats: UserStats;

  constructor() {
    this.sessions = new Map();
    this.moodRecords = new Map();
    this.stats = {
      id: randomUUID(),
      totalSessions: 0,
      totalMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      meditationLevel: "Beginner",
    };
  }
  
  private calculateMeditationLevel(totalSessions: number, totalMinutes: number, currentStreak: number): MeditationLevel {
    if (
      totalSessions >= levelThresholds.Master.minSessions &&
      totalMinutes >= levelThresholds.Master.minMinutes &&
      currentStreak >= levelThresholds.Master.minStreak
    ) {
      return "Master";
    } else if (
      totalSessions >= levelThresholds.Advanced.minSessions &&
      totalMinutes >= levelThresholds.Advanced.minMinutes &&
      currentStreak >= levelThresholds.Advanced.minStreak
    ) {
      return "Advanced";
    } else if (
      totalSessions >= levelThresholds.Intermediate.minSessions &&
      totalMinutes >= levelThresholds.Intermediate.minMinutes &&
      currentStreak >= levelThresholds.Intermediate.minStreak
    ) {
      return "Intermediate";
    }
    return "Beginner";
  }

  async createSession(insertSession: InsertMeditationSession): Promise<MeditationSession> {
    const id = randomUUID();
    const session: MeditationSession = {
      ...insertSession,
      id,
      completedAt: new Date(),
    };
    this.sessions.set(id, session);
    
    // Update stats
    await this.updateStats(Array.from(this.sessions.values()));
    
    return session;
  }

  async getSessions(): Promise<MeditationSession[]> {
    return Array.from(this.sessions.values()).sort(
      (a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime()
    );
  }

  async createMoodRecord(insertMood: InsertMoodRecord): Promise<MoodRecord> {
    const id = randomUUID();
    const moodRecord: MoodRecord = {
      ...insertMood,
      id,
      timestamp: new Date(),
    };
    this.moodRecords.set(id, moodRecord);
    return moodRecord;
  }

  async getMoodRecords(): Promise<MoodRecord[]> {
    return Array.from(this.moodRecords.values()).sort(
      (a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
    );
  }

  async getStats(): Promise<UserStats> {
    return this.stats;
  }

  async updateStats(sessions: MeditationSession[]): Promise<UserStats> {
    this.stats.totalSessions = sessions.length;
    this.stats.totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);

    // Calculate streaks
    const sortedSessions = [...sessions].sort(
      (a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime()
    );

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    sortedSessions.forEach((session) => {
      const sessionDate = new Date(session.completedAt || 0);
      sessionDate.setHours(0, 0, 0, 0);

      if (!lastDate) {
        tempStreak = 1;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (sessionDate.getTime() === today.getTime()) {
          currentStreak = 1;
        }
      } else {
        const dayDiff = Math.floor(
          (lastDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (dayDiff === 1) {
          tempStreak++;
          if (currentStreak > 0) currentStreak++;
        } else if (dayDiff > 1) {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
          currentStreak = 0;
        }
      }

      lastDate = sessionDate;
    });

    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    this.stats.currentStreak = currentStreak;
    this.stats.longestStreak = longestStreak;
    this.stats.meditationLevel = this.calculateMeditationLevel(
      this.stats.totalSessions,
      this.stats.totalMinutes,
      currentStreak
    );

    return this.stats;
  }
}

// Database Storage implementation
export class DatabaseStorage implements IStorage {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined");
    }
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql);
  }

  private calculateMeditationLevel(totalSessions: number, totalMinutes: number, currentStreak: number): MeditationLevel {
    if (
      totalSessions >= levelThresholds.Master.minSessions &&
      totalMinutes >= levelThresholds.Master.minMinutes &&
      currentStreak >= levelThresholds.Master.minStreak
    ) {
      return "Master";
    } else if (
      totalSessions >= levelThresholds.Advanced.minSessions &&
      totalMinutes >= levelThresholds.Advanced.minMinutes &&
      currentStreak >= levelThresholds.Advanced.minStreak
    ) {
      return "Advanced";
    } else if (
      totalSessions >= levelThresholds.Intermediate.minSessions &&
      totalMinutes >= levelThresholds.Intermediate.minMinutes &&
      currentStreak >= levelThresholds.Intermediate.minStreak
    ) {
      return "Intermediate";
    }
    return "Beginner";
  }

  async createSession(insertSession: InsertMeditationSession): Promise<MeditationSession> {
    const [session] = await this.db
      .insert(meditationSessions)
      .values(insertSession)
      .returning();
    
    // Update stats
    const sessions = await this.getSessions();
    await this.updateStats(sessions);
    
    return session;
  }

  async getSessions(): Promise<MeditationSession[]> {
    const sessions = await this.db.select().from(meditationSessions);
    return sessions.sort(
      (a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime()
    );
  }

  async createMoodRecord(insertMood: InsertMoodRecord): Promise<MoodRecord> {
    const [moodRecord] = await this.db
      .insert(moodRecords)
      .values(insertMood)
      .returning();
    return moodRecord;
  }

  async getMoodRecords(): Promise<MoodRecord[]> {
    const records = await this.db.select().from(moodRecords);
    return records.sort(
      (a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
    );
  }

  async getStats(): Promise<UserStats> {
    const allStats = await this.db.select().from(userStats);
    
    if (allStats.length === 0) {
      // Initialize stats
      const [newStats] = await this.db
        .insert(userStats)
        .values({
          totalSessions: 0,
          totalMinutes: 0,
          currentStreak: 0,
          longestStreak: 0,
          meditationLevel: "Beginner",
        })
        .returning();
      return newStats;
    }
    
    return allStats[0];
  }

  async updateStats(sessions: MeditationSession[]): Promise<UserStats> {
    const currentStats = await this.getStats();
    
    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);

    // Calculate streaks
    const sortedSessions = [...sessions].sort(
      (a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime()
    );

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    sortedSessions.forEach((session) => {
      const sessionDate = new Date(session.completedAt || 0);
      sessionDate.setHours(0, 0, 0, 0);

      if (!lastDate) {
        tempStreak = 1;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (sessionDate.getTime() === today.getTime()) {
          currentStreak = 1;
        }
      } else {
        const dayDiff = Math.floor(
          (lastDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (dayDiff === 1) {
          tempStreak++;
          if (currentStreak > 0) currentStreak++;
        } else if (dayDiff > 1) {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
          currentStreak = 0;
        }
      }

      lastDate = sessionDate;
    });

    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
    const meditationLevel = this.calculateMeditationLevel(totalSessions, totalMinutes, currentStreak);

    const [updatedStats] = await this.db
      .update(userStats)
      .set({
        totalSessions,
        totalMinutes,
        currentStreak,
        longestStreak,
        meditationLevel,
      })
      .where(eq(userStats.id, currentStats.id))
      .returning();

    return updatedStats;
  }
}

// Use DatabaseStorage if DATABASE_URL is available, otherwise fallback to MemStorage
export const storage = process.env.DATABASE_URL 
  ? new DatabaseStorage() 
  : new MemStorage();
