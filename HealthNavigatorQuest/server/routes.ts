import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertGameSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register routes
  
  // User registration
  app.post("/api/users/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(validatedData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(validatedData);
      return res.status(201).json({ 
        id: user.id, 
        username: user.username 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Failed to register user" });
    }
  });

  // Login (simplified for demo)
  app.post("/api/users/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      return res.status(200).json({ 
        id: user.id, 
        username: user.username 
      });
    } catch (error) {
      return res.status(500).json({ message: "Login failed" });
    }
  });

  // Save game state
  app.post("/api/games/save", async (req, res) => {
    try {
      const { username, gameState } = req.body;
      const now = new Date().toISOString();
      
      const existingGame = await storage.getGameByUsername(username);
      
      if (existingGame) {
        const updatedGame = await storage.updateGame(existingGame.id, gameState);
        return res.status(200).json(updatedGame);
      } else {
        const gameData = {
          username,
          gameState,
          createdAt: now,
          updatedAt: now
        };
        
        const validatedData = insertGameSchema.parse(gameData);
        const game = await storage.saveGame(validatedData);
        return res.status(201).json(game);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Failed to save game" });
    }
  });

  // Load game state
  app.get("/api/games/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const game = await storage.getGameByUsername(username);
      
      if (!game) {
        return res.status(404).json({ message: "No saved game found" });
      }
      
      return res.status(200).json(game);
    } catch (error) {
      return res.status(500).json({ message: "Failed to load game" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
