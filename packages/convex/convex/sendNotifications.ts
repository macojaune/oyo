"use node"

import { v } from "convex/values"
import { api } from "./_generated/api"
import { action } from "./_generated/server"
import { Expo, ExpoPushToken } from "expo-server-sdk"

export const sendPushToAll = action({
    args: {
        title: v.string(),
        body: v.string(),
        data: v.optional(v.record(v.string(), v.any()))
    },
    handler: async (ctx, { title, body, data }) => {
        const users = await ctx.runQuery<Doc<"users">[]>(api.users.getAllUsers)

        const pushTokens = users
            .map(user => user.pushToken)
            .filter((token): token is string => token !== undefined)

        if (pushTokens.length === 0) {
            return { success: false, message: "No users with push tokens found" }
        }
        const expo = new Expo()

        try {
            const results = await Promise.all(
                pushTokens.map(async (token: string) => {

                    // Check if the push token is valid
                    if (!Expo.isExpoPushToken(token)) {
                        console.error("Invalid Expo push token: "
                        )
                        return false
                    }

                    // Create the message
                    const message = {
                        to: token,
                        sound: "default",
                        title: title,
                        body: body,
                        data: data,
                    }

                        return expo.sendPushNotificationsAsync([message])
                       
                
                }
                ))

            const successful = results.filter(r => r.ok).length
            return {
                success: true,
                message: `Successfully sent ${successful}/${pushTokens.length} notifications`
            }
        } catch (error) {
            return {
                success: false,
                message: `Failed to send notifications: ${error}`
            }
        }
    },
})
