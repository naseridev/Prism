"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, RefreshCw, Copy, Shield, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { type RoomData, ANIMATION_CONFIG, ErrorCode, createError, type AppError } from "@/types"
import ErrorDisplay from "./error-display"

interface RoomSetupModalProps {
  onClose: () => void
  onSetup: (data: RoomData, userName: string) => void
  existingRoom: RoomData | null
}

/**
 * Modal for creating or joining a chat room
 */
export default function RoomSetupModal({ onClose, onSetup, existingRoom }: RoomSetupModalProps) {
  const [activeTab, setActiveTab] = useState<"create" | "join">("create")

  // Create room state
  const [roomName, setRoomName] = useState(existingRoom?.name || "")
  const [inviteCode, setInviteCode] = useState(existingRoom?.inviteCode || "")

  // Initialize userName from props if editing an existing room
  const [userName, setUserName] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("prism-username") || ""
    }
    return ""
  })

  // Fix the issue with window not being defined in SSR
  useEffect(() => {
    // Initialize userName from localStorage if available
    const storedName = typeof window !== "undefined" ? window.localStorage.getItem("prism-username") : null
    if (storedName) {
      setUserName(storedName)
    }
  }, [])

  // Join room state
  const [joinInviteCode, setJoinInviteCode] = useState("")
  const [error, setError] = useState<AppError | null>(null)

  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Generate random invite code on mount if creating a new room
  useEffect(() => {
    if (!existingRoom && activeTab === "create" && !inviteCode) {
      generateInviteCode()
    }
  }, [existingRoom, activeTab])

  // Add a helper function to get the current username
  const getCurrentUserName = () => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("prism-username") || ""
    }
    return ""
  }

  // Update the useEffect to use this helper
  useEffect(() => {
    if (existingRoom) {
      const currentUserName = getCurrentUserName()
      if (currentUserName) {
        setUserName(currentUserName)
      }
    }
  }, [existingRoom])

  /**
   * Generates a random invite code
   */
  const generateInviteCode = () => {
    try {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase()
      setInviteCode(code)
    } catch (err) {
      setError(createError(ErrorCode.UNKNOWN_ERROR, "Failed to generate invite code. Please try again."))
    }
  }

  /**
   * Copies text to clipboard with visual feedback
   */
  const copyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      setError(
        createError(ErrorCode.UNKNOWN_ERROR, "Failed to copy to clipboard. Please try manually copying the text."),
      )
    }
  }

  /**
   * Validates room creation form
   */
  const validateCreateRoom = (): boolean => {
    if (!roomName.trim()) {
      setError(createError(ErrorCode.VALIDATION_ERROR, "Room name is needed to create your space"))
      return false
    }

    if (!userName.trim()) {
      setError(createError(ErrorCode.VALIDATION_ERROR, "Please enter your name to continue"))
      return false
    }

    if (!inviteCode.trim()) {
      setError(createError(ErrorCode.VALIDATION_ERROR, "An invite code helps others join your room"))
      return false
    }

    return true
  }

  /**
   * Validates room joining form
   */
  const validateJoinRoom = (): boolean => {
    if (!userName.trim()) {
      setError(createError(ErrorCode.VALIDATION_ERROR, "Please enter your name to continue"))
      return false
    }

    if (!joinInviteCode.trim()) {
      setError(createError(ErrorCode.VALIDATION_ERROR, "An invite code is needed to find the room"))
      return false
    }

    return true
  }

  /**
   * Handles room creation
   */
  const handleCreateRoom = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      if (!validateCreateRoom()) {
        setIsSubmitting(false)
        return
      }

      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 500))

      onSetup(
        {
          name: roomName,
          inviteCode,
          maxParticipants: 50,
          isHost: true,
        },
        userName,
      )
    } catch (err) {
      setError(createError(ErrorCode.UNKNOWN_ERROR, "Failed to create room. Please try again."))
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handles joining an existing room
   */
  const handleJoinRoom = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      if (!validateJoinRoom()) {
        setIsSubmitting(false)
        return
      }

      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Simulate room not found error (randomly for demo)
      if (Math.random() > 0.8) {
        throw new Error("Room not found")
      }

      onSetup(
        {
          name: "Joined Room",
          inviteCode: joinInviteCode,
          maxParticipants: 50,
          isHost: false,
        },
        userName,
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to join room"
      setError(
        createError(
          ErrorCode.ROOM_ERROR,
          message === "Room not found"
            ? "We couldn't find that room. Double-check the invite code?"
            : "Couldn't join the room right now. Mind trying again?",
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: ANIMATION_CONFIG.DURATION, ease: ANIMATION_CONFIG.STANDARD_EASE }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.98 }}
        transition={{ duration: ANIMATION_CONFIG.DURATION, ease: ANIMATION_CONFIG.STANDARD_EASE }}
        className="w-full max-w-md"
      >
        <GlassCard className="rounded-lg p-6" intensity="high">
          <div className="flex flex-row items-center justify-between mb-6">
            <h2 className="text-xl font-medium">{existingRoom ? "Room Settings" : "Create or Join Room"}</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="mb-4">
                <ErrorDisplay error={error} onDismiss={() => setError(null)} />
              </div>
            )}

            {!existingRoom && (
              <Tabs
                defaultValue="create"
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as "create" | "join")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-black/30 backdrop-blur-sm">
                  <TabsTrigger value="create" className="data-[state=active]:bg-white/10">
                    <Shield className="mr-2 h-4 w-4" />
                    Create
                  </TabsTrigger>
                  <TabsTrigger value="join" className="data-[state=active]:bg-white/10">
                    <Users className="mr-2 h-4 w-4" />
                    Join
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="create" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="room-name" className="text-sm font-medium">
                      Room Name
                    </Label>
                    <Input
                      id="room-name"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="Enter room name"
                      className="border-white/10 bg-black/40 text-white backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user-name" className="text-sm font-medium">
                      Your Name
                    </Label>
                    <Input
                      id="user-name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name"
                      className="border-white/10 bg-black/40 text-white backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="invite-code" className="text-sm font-medium">
                        Invite Code
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-zinc-400 hover:text-white"
                        onClick={generateInviteCode}
                      >
                        <RefreshCw className="mr-1 h-3 w-3" />
                        <span className="text-xs">Regenerate</span>
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="invite-code"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        className="border-white/10 bg-black/40 text-white backdrop-blur-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-white/10 bg-black/30 text-zinc-400 hover:text-white backdrop-blur-sm"
                        onClick={() => copyToClipboard(inviteCode)}
                      >
                        <Copy className={cn("h-4 w-4", copied && "text-white")} />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="join" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="join-user-name" className="text-sm font-medium">
                      Your Name
                    </Label>
                    <Input
                      id="join-user-name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name"
                      className="border-white/10 bg-black/40 text-white backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="join-invite-code" className="text-sm font-medium">
                      Invite Code
                    </Label>
                    <Input
                      id="join-invite-code"
                      placeholder="Enter invite code"
                      value={joinInviteCode}
                      onChange={(e) => {
                        setJoinInviteCode(e.target.value.toUpperCase())
                      }}
                      className="border-white/10 bg-black/40 text-white backdrop-blur-sm placeholder:text-zinc-500"
                    />
                    <p className="text-xs text-zinc-500">The code shared by the room host</p>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {existingRoom && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-name-edit" className="text-sm font-medium">
                    Your Name
                  </Label>
                  <Input
                    id="user-name-edit"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="border-white/10 bg-black/40 text-white backdrop-blur-sm"
                  />
                  <p className="text-xs text-zinc-500">This is how others will see you in the chat</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room-name" className="text-sm font-medium">
                    Room Name
                  </Label>
                  <Input
                    id="room-name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter room name"
                    className="border-white/10 bg-black/40 text-white backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="invite-code" className="text-sm font-medium">
                      Invite Code
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-zinc-400 hover:text-white"
                      onClick={generateInviteCode}
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      <span className="text-xs">Regenerate</span>
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="invite-code"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      className="border-white/10 bg-black/40 text-white backdrop-blur-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-white/10 bg-black/30 text-zinc-400 hover:text-white backdrop-blur-sm"
                      onClick={() => copyToClipboard(inviteCode)}
                    >
                      <Copy className={cn("h-4 w-4", copied && "text-white")} />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <GlassButton variant="default" onClick={onClose}>
              Cancel
            </GlassButton>
            {!existingRoom ? (
              activeTab === "create" ? (
                <GlassButton variant="solid" onClick={handleCreateRoom} disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Room"}
                </GlassButton>
              ) : (
                <GlassButton variant="solid" onClick={handleJoinRoom} disabled={isSubmitting}>
                  {isSubmitting ? "Joining..." : "Join Room"}
                </GlassButton>
              )
            ) : (
              <GlassButton variant="solid" onClick={handleCreateRoom} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </GlassButton>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
