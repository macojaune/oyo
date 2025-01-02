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
    })
  },
})
