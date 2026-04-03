import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const authenticate = mutation({
  args: { username: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (existing) {
      if (existing.password === args.password) return existing;
      throw new Error("Invalid password");
    }

    const userId = await ctx.db.insert("users", {
      username: args.username,
      password: args.password,
      totalWinnings: 1000,
      gamesPlayed: 0,
      lastPlayed: Date.now(),
    });
    
    return await ctx.db.get(userId);
  },
});

export const updateScore = mutation({
  args: { userId: v.id("users"), amount: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return;
    
    await ctx.db.patch(args.userId, {
      totalWinnings: user.totalWinnings + args.amount,
      gamesPlayed: user.gamesPlayed + 1,
      lastPlayed: Date.now(),
    });
  },
});

export const get = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const getLeaderboard = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("by_winnings")
      .order("desc")
      .take(10);
  },
});
