// Core types used throughout the application
export interface Message {
  id: string
  content: string
  sender: string
  timestamp: Date
  isSystem?: boolean
}

export interface Participant {
  id: string
  name: string
  isHost: boolean
}

export interface RoomData {
  id?: string
  name: string
  inviteCode: string
  password?: string
  maxParticipants: number
  isHost: boolean
  createdAt?: Date
}

// Animation constants
export const ANIMATION_CONFIG = {
  STANDARD_EASE: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  DURATION: 0.15,
}

// Error handling
export interface AppError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export enum ErrorCode {
  NETWORK_ERROR = "network_error",
  VALIDATION_ERROR = "validation_error",
  AUTHENTICATION_ERROR = "auth_error",
  ROOM_ERROR = "room_error",
  UNKNOWN_ERROR = "unknown_error",
}

export const createError = (code: ErrorCode, message: string, details?: Record<string, unknown>): AppError => ({
  code,
  message,
  details,
})

// Add a new helper function for friendly error messages
export const getFriendlyErrorMessage = (code: ErrorCode, message: string): string => {
  // Make error messages more conversational and user-friendly
  switch (code) {
    case ErrorCode.NETWORK_ERROR:
      return "Looks like you're offline. Check your connection and try again."
    case ErrorCode.VALIDATION_ERROR:
      return message.replace("Please enter", "Please add").replace("cannot be empty", "is needed")
    case ErrorCode.AUTHENTICATION_ERROR:
      return message
        .replace("Authentication failed", "Couldn't verify your access")
        .replace("Invalid credentials", "Your login details don't match our records")
    case ErrorCode.ROOM_ERROR:
      return message.replace("Failed to", "Couldn't").replace("Room not found", "We couldn't find that room")
    case ErrorCode.UNKNOWN_ERROR:
      return "Something unexpected happened. Let's try again?"
    default:
      return message
  }
}
