import { authRouter } from "./router/auth"
import { notificationRouter } from "./router/notification"
import { postRouter } from "./router/post"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  notification: notificationRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
