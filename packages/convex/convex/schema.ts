import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  groups: defineTable({ title: v.string(), isLive: v.optional(v.boolean()) }),

  positions: defineTable({
    longitude: v.number(),
    latitude: v.number(),
    group: v.id("groups"),
    fromApp: v.boolean(),
    owner: v.optional(v.id("users")),
  }).index("by_group", ["group"]),

  users: defineTable({
    pushToken: v.optional(v.string()),
    group: v.optional(v.id("groups")),
    isActive: v.optional(v.boolean()),
  }),
})
