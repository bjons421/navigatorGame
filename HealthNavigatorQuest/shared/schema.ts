import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Game record for saving/loading games
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  gameState: text("gameState").notNull(), // Serialized game state
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// Base user record
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Game schemas
export const gameStateSchema = z.object({
  clientId: z.number(),
  client: z.lazy(() => clientSchema).optional(), // Reference to the client object
  level: z.number(),
  turn: z.number(),
  score: z.number(),
  clientHealth: z.number(),
  clientKnowledge: z.number().optional(), // Keeping optional for backward compatibility
  clientConfidence: z.number().optional(), // Keeping optional for backward compatibility
  levelProgress: z.array(z.number()),
  insuranceStatus: z.string(),
  events: z.array(z.number()),
  completedEvents: z.array(z.number()),
});

export interface ClientAttributes {
  technologicalProficiency: number;
  healthStatus: {
    chronicConditions: string[];
    riskLevel: 'low' | 'medium' | 'high';
  };
  lifestyle: {
    employment: 'full-time' | 'part-time' | 'unemployed' | 'self-employed';
    familyResponsibilities: string[];
    schedule: 'flexible' | 'rigid';
    transportation: 'reliable' | 'limited' | 'none';
  };
  barriers: {
    language: 'none' | 'moderate' | 'significant';
    literacy: 'high' | 'medium' | 'low';
    internetAccess: 'reliable' | 'limited' | 'none';
  };
}

export interface Client {
  id: number;
  name: string;
  avatar: string;
  status: string;
  concerns: string[];
  attributes: ClientAttributes;
}

export const clientSchema = z.object({
  id: z.number(),
  name: z.string(),
  avatar: z.string(),
  status: z.string(),
  concerns: z.array(z.string()),
  attributes: z.object({
    technologicalProficiency: z.number(),
    healthStatus: z.object({
      chronicConditions: z.array(z.string()),
      riskLevel: z.enum(['low', 'medium', 'high']),
    }),
    lifestyle: z.object({
      employment: z.enum(['full-time', 'part-time', 'unemployed', 'self-employed']),
      familyResponsibilities: z.array(z.string()),
      schedule: z.enum(['flexible', 'rigid']),
      transportation: z.enum(['reliable', 'limited', 'none']),
    }),
    barriers: z.object({
      language: z.enum(['none', 'moderate', 'significant']),
      literacy: z.enum(['high', 'medium', 'low']),
      internetAccess: z.enum(['reliable', 'limited', 'none']),
    }),
  }),
});

export const eventSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  prompt: z.string().optional(),
  level: z.number(),
  healthImpact: z.number().optional().default(0),
  options: z.array(z.object({
    id: z.number(),
    text: z.string(),
    healthEffect: z.number(),
    knowledgeEffect: z.number().optional(), // Making optional
    confidenceEffect: z.number().optional(), // Making optional
    scoreEffect: z.number(),
    turnEffect: z.number(),
    outcome: z.string()
  }))
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameSchema = createInsertSchema(games).pick({
  username: true,
  gameState: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

export type GameState = z.infer<typeof gameStateSchema>;
export type Client = z.infer<typeof clientSchema>;
export type GameEvent = z.infer<typeof eventSchema>;
export type EventOption = z.infer<typeof eventSchema>["options"][number];