"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, Settings, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassCard } from "@/components/ui/glass-card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import ChatMessage from "./chat-message"
import Sidebar from "./sidebar"
import { useMobile } from "@/hooks/use-mobile"
import ChatSettings from "./chat-settings"
import RoomSetupModal from "./room-setup-modal"
import { ErrorBoundary } from "./error-boundary"
import ErrorDisplay from "./error-display"
import {
  type Message,
  type Participant,
  type RoomData,
  ANIMATION_CONFIG,
  type AppError,
  ErrorCode,
  createError,
} from "@/types"

/**
 * Main chat interface component
 * Handles room state, messages, and UI interactions
 */
export default function ChatInterface() {
  // State management
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [roomSetupOpen, setRoomSetupOpen] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<RoomData | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [error, setError] = useState<AppError | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()
  // Initialize userName from localStorage if available
  const [userName, setUserName] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("prism-username") || "You"
    }
    return "You"
  })

  /**
   * Handles sending a new message
   * If no room exists, prompts room creation
   */
  const handleSendMessage = () => {
    if (inputValue.trim() === "") return
    if (!currentRoom) {
      setRoomSetupOpen(true)
      return
    }

    try {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: inputValue,
        sender: userName,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, newMessage])
      setInputValue("")

      // Simulate response for demo purposes
      setTimeout(() => {
        const names = ["Alex", "Taylor", "Jordan"]
        const randomName = names[Math.floor(Math.random() * names.length)]
        const responses = [
          "That's interesting!",
          "I agree with you.",
          "Could you explain more?",
          "Thanks for sharing that.",
          "I hadn't thought of it that way.",
          "I hadn't thought of it that way.",
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]

        const responseMessage: Message = {
          id: Date.now().toString(),
          content: randomResponse,
          sender: randomName,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, responseMessage])
      }, 2000)
    } catch (err) {
      setError(createError(ErrorCode.UNKNOWN_ERROR, "Message didn't send. Mind trying again?"))
    }
  }

  /**
   * Handles keyboard shortcuts for sending messages
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /**
   * Sets up a new room with the provided configuration
   */
  const handleRoomSetup = (roomData: RoomData, name: string) => {
    try {
      setCurrentRoom(roomData)
      setUserName(name)
      setRoomSetupOpen(false)

      // Save username to localStorage for persistence
      window.localStorage.setItem("prism-username", name)

      // Set initial participants
      setParticipants([
        { id: "1", name: name, isHost: roomData.isHost },
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
    } catch (err) {
      setError(createError(ErrorCode.ROOM_ERROR, "Room setup didn't complete. Let's try again?"))
    }
  }

  /**
   * Updates room settings and notifies participants
   */
  const updateRoomSettings = (newSettings: Partial<RoomData>) => {
    if (!currentRoom) return

    try {
      setCurrentRoom((prev) => ({
        ...prev!,
        ...newSettings,
      }))

      setSettingsOpen(false)

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
    } catch (err) {
      setError(createError(ErrorCode.ROOM_ERROR, "Settings didn't save. Mind trying again?"))
    }
  }

  /**
   * Updates the user's display name
   */
  const handleUpdateUserName = (newName: string) => {
    try {
      const oldName = userName
      setUserName(newName)

      // Save username to localStorage for persistence
      window.localStorage.setItem("prism-username", newName)

      // Add system message about name change
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: `${oldName} changed their name to ${newName}.`,
          sender: "System",
          timestamp: new Date(),
          isSystem: true,
        },
      ])
    } catch (err) {
      setError(createError(ErrorCode.UNKNOWN_ERROR, "Couldn't update your name. Mind trying again?"))
    }
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen w-full overflow-hidden">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: ANIMATION_CONFIG.DURATION, ease: ANIMATION_CONFIG.STANDARD_EASE }}
              className="absolute z-10 h-full md:relative"
            >
              <Sidebar
                onClose={() => setSidebarOpen(false)}
                participants={participants}
                roomData={currentRoom}
                onCreateRoom={() => setRoomSetupOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {settingsOpen && currentRoom && (
            <ChatSettings
              roomData={currentRoom}
              userName={userName}
              onClose={() => setSettingsOpen(false)}
              onUpdate={updateRoomSettings}
              onUpdateUserName={handleUpdateUserName}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {roomSetupOpen && (
            <RoomSetupModal
              onClose={() => setRoomSetupOpen(false)}
              onSetup={handleRoomSetup}
              existingRoom={currentRoom}
            />
          )}
        </AnimatePresence>

        <div className="flex flex-1 flex-col">
          {/* Header with glassmorphism */}
          <GlassCard className="sticky top-0 z-10 flex items-center justify-between p-4" intensity="medium">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-zinc-400 hover:text-white"
              >
                <Menu size={20} />
              </Button>
              <div>
                <h1 className="text-lg font-medium tracking-tight">{currentRoom ? currentRoom.name : "Prism"}</h1>
                {currentRoom && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3 text-white" />
                      <span className="text-xs text-zinc-400">{currentRoom.inviteCode}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentRoom && (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <GlassCard className="flex items-center gap-1 rounded-full px-2 py-1" intensity="low">
                          <Users className="h-3 w-3 text-white" />
                          <span className="text-xs font-medium">
                            {participants.length}/
                            {currentRoom.maxParticipants === 50 ? "∞" : currentRoom.maxParticipants}
                          </span>
                        </GlassCard>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {participants.length} of{" "}
                          {currentRoom.maxParticipants === 50 ? "unlimited" : currentRoom.maxParticipants}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {currentRoom.isHost && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-400 hover:text-white"
                      onClick={() => setSettingsOpen(true)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}

              {!currentRoom && (
                <GlassButton
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setRoomSetupOpen(true)}
                >
                  <Shield className="h-4 w-4 mr-1" />
                  <span>Create Room</span>
                </GlassButton>
              )}
            </div>
          </GlassCard>

          {/* Error display */}
          {error && (
            <div className="mx-auto w-full max-w-3xl px-4 pt-4">
              <ErrorDisplay error={error} onDismiss={() => setError(null)} />
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mx-auto max-w-3xl space-y-4">
              {messages.length === 0 && !currentRoom && (
                <div className="flex h-full flex-col items-center justify-center py-20 text-center">
                  <GlassCard className="mb-4 rounded-full p-4" intensity="high">
                    <Shield className="h-8 w-8 text-white" />
                  </GlassCard>
                  <h2 className="mb-2 text-xl font-medium">Welcome to Prism</h2>
                  <p className="mb-6 max-w-md text-zinc-400">
                    Create a secure chat room to start messaging or join an existing room with an invite code.
                  </p>
                  <GlassButton variant="solid" onClick={() => setRoomSetupOpen(true)}>
                    Get Started
                  </GlassButton>
                </div>
              )}

              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} currentUser={userName} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <GlassCard className="p-4" intensity="medium">
            <div
              className={cn(
                "mx-auto flex max-w-3xl items-end gap-2 rounded-lg border border-white/10 bg-black/30 p-2 transition-all focus-within:border-white/30 backdrop-blur-md",
                inputValue && "border-white/30",
              )}
            >
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={currentRoom ? "Message..." : "Create a room to start chatting..."}
                className="max-h-32 flex-1 resize-none bg-transparent p-2 text-white outline-none placeholder:text-zinc-500"
                rows={1}
                style={{
                  height: "auto",
                  minHeight: "2.5rem",
                }}
              />
              <GlassButton
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                size="icon"
                variant={inputValue.trim() ? "solid" : "default"}
                className={cn("h-10 w-10 rounded-full", !inputValue.trim() && "opacity-50")}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transform rotate-45"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </ErrorBoundary>
  )
}
