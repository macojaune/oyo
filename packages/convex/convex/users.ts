import { v } from "convex/values"

import { mutation, query } from "./_generated/server"

export const create = mutation({
  args: { pushToken: v.string() },
  handler: async (ctx, { pushToken }) => {
    return await ctx.db.insert("users", { pushToken })
  },
})

export const startTracking = mutation({
  args: { userId: v.id("users"), group: v.id("groups") },
  handler: async (ctx, { userId, group }) => {
    // Check if there's already an active user for this group
    const activeUser = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(q.eq(q.field("group"), group), q.eq(q.field("isActive"), true)),
      )
      .unique()

    if (activeUser) {
      // Instead of throwing, return false to indicate we couldn't start tracking
      return false
    }

    // Set user as active for this group
    await ctx.db.patch(userId, {
      group,
      isActive: true,
    })

    // Update group's isLive status
    await ctx.db.patch(group, { isLive: true })

    return true
  },
})

export const stopTracking = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId)
    if (!user) return false

    // Deactivate user
    await ctx.db.patch(userId, {
      isActive: false,
    })

    if (user.group) {
      // Check if this was the last active user
      const activeUsers = await ctx.db
        .query("users")
        .filter((q) =>
          q.and(
            q.eq(q.field("group"), user.group),
            q.eq(q.field("isActive"), true),
          ),
        )
        .collect()

      if (activeUsers.length === 0) {
        // todo push notif to others group members
        await ctx.db.patch(user.group, { isLive: false })
      }
    }

    return true
  },
})

export const getActiveUsers = query({
  args: { group: v.id("groups") },
  handler: async (ctx, { group }) => {
    return await ctx.db
      .query("users")
      .filter((q) =>
        q.and(q.eq(q.field("group"), group), q.eq(q.field("isActive"), true)),
      )
      .collect()
  },
})

export const getAllUsers = query({
  args: {},
  handler: async (ctx,) => {
    return await ctx.db
      .query("users")
      .collect()
  },
})
