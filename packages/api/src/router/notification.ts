import { TRPCError  } from "@trpc/server"
import type {TRPCRouterRecord} from "@trpc/server";
import { Expo } from "expo-server-sdk"
import { z } from "zod"

import {  publicProcedure } from "../trpc"

const expo = new Expo()

export const notificationRouter = {
  send: publicProcedure
    .input(
      z.object({
        token: z.string(),
        title: z.string(),
        body: z.string(),
        data: z.record(z.any()).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      // Check if the push token is valid
      if (!Expo.isExpoPushToken(input.token)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Expo push token",
        })
      }

      // Create the message
      const message = {
        to: input.token,
        sound: "default",
        title: input.title,
        body: input.body,
        data: input.data,
      }

      try {
        const ticket = await expo.sendPushNotificationsAsync([message])
        return { success: true, ticket: ticket[0] }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send push notification",
          cause: error,
        })
      }
    }),
} satisfies TRPCRouterRecord