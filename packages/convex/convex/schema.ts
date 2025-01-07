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
    username: v.string(),
    group: v.id("groups"),
  }),
})
