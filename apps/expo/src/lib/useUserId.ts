import AsyncStorage from "@react-native-async-storage/async-storage"
import { v4 as uuidv4 } from "uuid"

const USER_ID_KEY = "omasla-userId"

export const useUserId = () => {
  const generateUUID = () => {
    // Generate UUID v4 (random-based)
    return uuidv4()
  }

  const getUserId = async () => {
    try {
      // Try to get existing ID
      let userId = await AsyncStorage.getItem(USER_ID_KEY)

      // If no ID exists, create and store a new one
      if (!userId) {
        userId = generateUUID()
        await AsyncStorage.setItem(USER_ID_KEY, userId)
      }

      return userId
    } catch (error) {
      console.error("Error managing user ID:", error)
      throw error
    }
  }

  const resetUserId = async () => {
    try {
      const newUserId = generateUUID()
      await AsyncStorage.setItem(USER_ID_KEY, newUserId)
      return newUserId
    } catch (error) {
      console.error("Error resetting user ID:", error)
      throw error
    }
  }

  const removeUserId = async () => {
    try {
      await AsyncStorage.removeItem(USER_ID_KEY)
    } catch (error) {
      console.error("Error removing user ID:", error)
      throw error
    }
  }

  return {
    getUserId,
    resetUserId,
    removeUserId,
  }
}
