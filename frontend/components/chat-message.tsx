"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { GlassCard } from "@/components/ui/glass-card"
import { type Message, ANIMATION_CONFIG } from "@/types"

interface ChatMessageProps {
  message: Message
  currentUser: string
}

/**
 * Renders an individual chat message with appropriate styling
 */
export default function ChatMessage({ message, currentUser }: ChatMessageProps) {
  const isCurrentUser = message.sender === currentUser
  const isSystem = message.isSystem

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_CONFIG.DURATION, ease: ANIMATION_CONFIG.STANDARD_EASE }}
      className={cn("flex", isCurrentUser ? "justify-end" : "justify-start", isSystem && "justify-center")}
    >
      {!isSystem && (
        <div className={cn("max-w-[80%]")}>
          {!isCurrentUser && <p className="mb-1 text-xs font-medium text-zinc-400">{message.sender}</p>}
          <GlassCard
            className={cn(
              "rounded-lg px-4 py-2",
              isCurrentUser ? "bg-white text-black backdrop-blur-md" : "text-zinc-300 backdrop-blur-sm",
            )}
            intensity={isCurrentUser ? "high" : "medium"}
            border={false}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </GlassCard>
          <div className={cn("mt-1 text-xs text-zinc-500", isCurrentUser && "text-right")}>
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      )}

      {isSystem && (
        <GlassCard
          className="max-w-[80%] rounded-lg px-4 py-2 text-center text-sm text-zinc-400"
          intensity="low"
          border={false}
        >
          {message.content}
        </GlassCard>
      )}
    </motion.div>
  )
}
