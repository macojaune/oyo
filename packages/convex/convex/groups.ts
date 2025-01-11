import { v } from "convex/values"

import { mutation, query } from "./_generated/server"

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("groups").collect()
  },
})

export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, { title }) => {
    return await ctx.db.insert("groups", {
      title,
      isLive: false
    })
  },
})

export const update = mutation({
  args: {
    groupId: v.id("groups"),
    isLive: v.boolean(),
  },
  handler: async (ctx, { groupId, isLive }) => {
    return await ctx.db.patch(groupId, {
      isLive,
    })
  },
})

export const isLive = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, { groupId }) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("group"), groupId))
      .collect()
    return users.length > 0
  },
})
