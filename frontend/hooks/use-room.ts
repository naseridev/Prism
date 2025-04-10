"use client"

import { useState, useCallback } from "react"
import { type RoomData, type Participant, type Message, ErrorCode, createError } from "@/types"
import { useAsync } from "@/hooks/use-async"

/**
 * Custom hook for managing room state and operations
 * Follows Silicon Valley standards for state management
 */
export function useRoom() {
  const [currentRoom, setCurrentRoom] = useState<RoomData | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  // Simulated room creation API call
  const createRoom = useAsync(async (roomData: RoomData, userName: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Set room data
    setCurrentRoom(roomData)

    // Initialize participants
    setParticipants([
      { id: "1", name: userName, isHost: roomData.isHost },
      { id: "2", name: "Alex", isHost: !roomData.isHost },
    ])

    // Add welcome message
    setMessages([
      {
        id: "1",
        content: `Welcome to ${roomData.name}! 👋`,
        sender: "System",
        timestamp: new Date(),
        isSystem: true,
      },
    ])

    return { roomData, userName }
  })

  // Simulated join room API call
  const joinRoom = useAsync(async (inviteCode: string, userName: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Simulate room not found (randomly for demo)
    if (Math.random() > 0.8) {
      throw new Error("Room not found")
    }

    const roomData: RoomData = {
      name: "Joined Room",
      inviteCode,
      maxParticipants: 50,
      isHost: false,
    }

    // Set room data
    setCurrentRoom(roomData)

    // Initialize participants
    setParticipants([
      { id: "1", name: userName, isHost: false },
      { id: "2", name: "Host User", isHost: true },
    ])

    // Add welcome message
    setMessages([
      {
        id: "1",
        content: `Welcome to ${roomData.name}! 👋`,
        sender: "System",
        timestamp: new Date(),
        isSystem: true,
      },
    ])

    return { roomData, userName }
  })

  // Update room settings
  const updateRoomSettings = useCallback(
    async (newSettings: Partial<RoomData>) => {
      if (!currentRoom) {
        throw createError(ErrorCode.ROOM_ERROR, "No active room to update")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setCurrentRoom((prev) => ({
        ...prev!,
        ...newSettings,
      }))

      // Add system message about updated settings
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "Room settings have been updated.",
          sender: "System",
          timestamp: new Date(),
          isSystem: true,
        },
      ])

      return { ...currentRoom, ...newSettings }
    },
    [currentRoom],
  )

  // Leave room
  const leaveRoom = useCallback(async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    setCurrentRoom(null)
    setParticipants([])
    setMessages([])

    return true
  }, [])

  return {
    currentRoom,
    participants,
    messages,
    setMessages,
    createRoom,
    joinRoom,
    updateRoomSettings,
    leaveRoom,
  }
}
