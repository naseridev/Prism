"use client"

import { AlertCircle, WifiOff, Lock, AlertTriangle, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { type AppError, ErrorCode } from "@/types"
import { cn } from "@/lib/utils"

interface ErrorDisplayProps {
  error: AppError
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
}

/**
 * Displays error messages with appropriate styling and actions
 */
export default function ErrorDisplay({ error, onRetry, onDismiss, className }: ErrorDisplayProps) {
  // Map error codes to appropriate icons and colors
  const getErrorIcon = () => {
    switch (error.code) {
      case ErrorCode.NETWORK_ERROR:
        return <WifiOff className="h-5 w-5" />
      case ErrorCode.AUTHENTICATION_ERROR:
        return <Lock className="h-5 w-5" />
      case ErrorCode.VALIDATION_ERROR:
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  // Get appropriate title based on error code
  const getErrorTitle = () => {
    switch (error.code) {
      case ErrorCode.NETWORK_ERROR:
        return "Connection Issue"
      case ErrorCode.AUTHENTICATION_ERROR:
        return "Access Needed"
      case ErrorCode.VALIDATION_ERROR:
        return "Quick Check"
      case ErrorCode.ROOM_ERROR:
        return "Room Issue"
      default:
        return "Heads Up"
    }
  }

  // Get friendly message based on error message
  const getFriendlyMessage = () => {
    // Make the error message more conversational and friendly
    return error.message
      .replace("Failed to", "Couldn't")
      .replace("Please try again", "Mind trying again?")
      .replace("Error", "issue")
  }

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <GlassCard className={cn("rounded-lg p-4", className)} intensity="medium">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
              {getErrorIcon()}
            </div>
            <div>
              <h4 className="mb-1 text-sm font-medium text-white">{getErrorTitle()}</h4>
              <p className="text-sm text-zinc-400">{getFriendlyMessage()}</p>
            </div>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDismiss}
              className="h-6 w-6 rounded-full p-0 text-zinc-400 hover:text-white"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
        {onRetry && (
          <div className="mt-3 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="h-8 border-white/10 bg-white/10 text-xs text-white hover:bg-white/20 backdrop-blur-sm"
            >
              Try Again
            </Button>
          </div>
        )}
      </GlassCard>
    </motion.div>
  )
}
