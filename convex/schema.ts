import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    password: v.string(), // Basic storage as requested
    totalWinnings: v.number(),
    gamesPlayed: v.number(),
    lastPlayed: v.number(),
  }).index("by_winnings", ["totalWinnings"])
    .index("by_username", ["username"]),
});
