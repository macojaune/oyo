import { v } from "convex/values"

import { mutation, query } from "./_generated/server"

export const add = mutation({
  args: { userId: v.string(), group: v.id("groups") },
  handler: async (ctx, { userId, group }) => {
    return await ctx.db.insert("users", { username: userId, group })
  },
})

export const remove = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), userId))
      .unique()
    if (!user) return
    return await ctx.db.delete(user._id)
  },
})
