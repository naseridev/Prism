"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Settings, Send, LogOut, Users, Clock, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import ChatSettings from "./chat-settings"

interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
  isSystem?: boolean
}

interface RoomData {
  inviteCode: string
  password?: string
  maxParticipants: number
  selfDestructTime?: number
  isHost: boolean
}

interface ChatRoomProps {
  roomData: RoomData
  onExit: () => void
}

const COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-orange-500",
]

export default function ChatRoom({ roomData, onExit }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "System",
      content: "Welcome to the chat room! 👋",
      timestamp: new Date(),
      isSystem: true,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [participants, setParticipants] = useState([
    { id: "1", name: "You", isHost: roomData.isHost },
    { id: "2", name: "Alex", isHost: !roomData.isHost },
  ])
  const [showSettings, setShowSettings] = useState(false)
  const [currentRoomData, setCurrentRoomData] = useState(roomData)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Calculate time remaining if self-destruct is enabled
  const selfDestructDate = currentRoomData.selfDestructTime
    ? new Date(Date.now() + currentRoomData.selfDestructTime * 60 * 60 * 1000)
    : null

  const [timeRemaining, setTimeRemaining] = useState<string | null>(
    selfDestructDate ? formatTimeRemaining(selfDestructDate) : null,
  )

  useEffect(() => {
    if (!selfDestructDate) return

    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(selfDestructDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [selfDestructDate])

  function formatTimeRemaining(endDate: Date): string {
    const now = new Date()
    const diff = Math.max(0, endDate.getTime() - now.getTime())

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: inputValue,
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
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const responseMessage: Message = {
        id: Date.now().toString(),
        sender: randomName,
        content: randomResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, responseMessage])
    }, 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const updateRoomSettings = (newSettings: Partial<RoomData>) => {
    setCurrentRoomData((prev) => ({ ...prev, ...newSettings }))
    setShowSettings(false)

    // Add system message about updated settings
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "System",
        content: "Room settings have been updated.",
        timestamp: new Date(),
        isSystem: true,
      },
    ])
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getColorForUser = (name: string) => {
    // Consistently assign the same color to the same user
    const index = name.charCodeAt(0) % COLORS.length
    return COLORS[index]
  }

  return (
    <>
      <Card className="flex h-[80vh] flex-col border-zinc-800 bg-zinc-900 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">ChatSphere</h2>
            <div className="flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-1">
              <Shield className="h-3 w-3 text-emerald-400" />
              <span className="text-xs font-medium">{currentRoomData.inviteCode}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-1">
                    <Users className="h-3 w-3 text-blue-400" />
                    <span className="text-xs font-medium">
                      {participants.length}/{currentRoomData.maxParticipants}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {participants.length} of {currentRoomData.maxParticipants} participants
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {timeRemaining && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-1">
                      <Clock className="h-3 w-3 text-yellow-400" />
                      <span className="text-xs font-medium">{timeRemaining}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Room will close in {timeRemaining}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {currentRoomData.isHost && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-white"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}

            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={onExit}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={cn("flex items-start gap-3", message.sender === "You" && "justify-end")}
              >
                {message.sender !== "You" && !message.isSystem && (
                  <Avatar className={cn("h-8 w-8", getColorForUser(message.sender))}>
                    <span className="text-xs font-bold text-white">{getInitials(message.sender)}</span>
                  </Avatar>
                )}

                <div className={cn("max-w-[70%]", message.sender === "You" && "order-1")}>
                  {message.sender !== "You" && !message.isSystem && (
                    <p className="mb-1 text-xs font-medium text-zinc-400">{message.sender}</p>
                  )}

                  <div
                    className={cn(
                      "rounded-lg px-4 py-2",
                      message.isSystem
                        ? "bg-zinc-800 text-center text-sm text-zinc-400"
                        : message.sender === "You"
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-800 text-white",
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>

                  <p className={cn("mt-1 text-xs text-zinc-500", message.sender === "You" && "text-right")}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {message.sender === "You" && (
                  <Avatar className="h-8 w-8 bg-blue-600">
                    <span className="text-xs font-bold text-white">{getInitials(message.sender)}</span>
                  </Avatar>
                )}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-zinc-800 p-4">
          <div className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500"
            />
            <Button
              className={cn(
                "h-10 w-10 rounded-full p-0",
                inputValue.trim() ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-zinc-800 text-zinc-500",
              )}
              disabled={!inputValue.trim()}
              onClick={handleSendMessage}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {showSettings && (
          <ChatSettings
            roomData={currentRoomData}
            onClose={() => setShowSettings(false)}
            onUpdate={updateRoomSettings}
          />
        )}
      </AnimatePresence>
    </>
  )
}
