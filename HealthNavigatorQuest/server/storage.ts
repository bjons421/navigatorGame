import { games, users, type User, type InsertUser, type Game, type InsertGame } from "@shared/schema";

// Storage interface with CRUD operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveGame(game: InsertGame): Promise<Game>;
  getGameByUsername(username: string): Promise<Game | undefined>;
  updateGame(id: number, gameState: string): Promise<Game | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  currentUserId: number;
  currentGameId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.currentUserId = 1;
    this.currentGameId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveGame(insertGame: InsertGame): Promise<Game> {
    const id = this.currentGameId++;
    const game: Game = { ...insertGame, id };
    this.games.set(id, game);
    return game;
  }

  async getGameByUsername(username: string): Promise<Game | undefined> {
    return Array.from(this.games.values()).find(
      (game) => game.username === username,
    );
  }

  async updateGame(id: number, gameState: string): Promise<Game | undefined> {
    const game = this.games.get(id);
    if (!game) return undefined;
    
    const updatedGame: Game = {
      ...game,
      gameState,
      updatedAt: new Date().toISOString(),
    };
    
    this.games.set(id, updatedGame);
    return updatedGame;
  }
}

export const storage = new MemStorage();
