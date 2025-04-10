"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, RefreshCw, Copy, Shield, Users, Lock, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { type RoomData, ANIMATION_CONFIG, type AppError, ErrorCode, createError } from "@/types"
import ErrorDisplay from "./error-display"

interface ChatSettingsProps {
  roomData: RoomData
  userName: string
  onClose: () => void
  onUpdate: (data: Partial<RoomData>) => void
  onUpdateUserName: (name: string) => void
}

/**
 * Settings panel for room configuration and user preferences
 */
export default function ChatSettings({ roomData, userName, onClose, onUpdate, onUpdateUserName }: ChatSettingsProps) {
  const [inviteCode, setInviteCode] = useState(roomData.inviteCode)
  const [roomName, setRoomName] = useState(roomData.name)
  const [displayName, setDisplayName] = useState(userName)
  const [maxParticipants, setMaxParticipants] = useState(roomData.maxParticipants)
  const [passwordEnabled, setPasswordEnabled] = useState(!!roomData.password)
  const [password, setPassword] = useState(roomData.password || "")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<AppError | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Generate password if enabled and not already set
  useEffect(() => {
    if (passwordEnabled && !password) {
      generatePassword()
    }
  }, [passwordEnabled])

  const generateInviteCode = () => {
    try {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase()
      setInviteCode(code)
    } catch (err) {
      setError(createError(ErrorCode.UNKNOWN_ERROR, "Failed to generate invite code. Please try again."))
    }
  }

  const generatePassword = () => {
    try {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      let result = ""
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      setPassword(result)
    } catch (err) {
      setError(createError(ErrorCode.UNKNOWN_ERROR, "Failed to generate password. Please try again."))
    }
  }

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

  const validateSettings = (): boolean => {
    if (!roomName.trim()) {
      setError(createError(ErrorCode.VALIDATION_ERROR, "Room name cannot be empty"))
      return false
    }

    if (!displayName.trim()) {
      setError(createError(ErrorCode.VALIDATION_ERROR, "Display name cannot be empty"))
      return false
    }

    if (!inviteCode.trim()) {
      setError(createError(ErrorCode.VALIDATION_ERROR, "Invite code cannot be empty"))
      return false
    }

    if (passwordEnabled && !password.trim()) {
      setError(createError(ErrorCode.VALIDATION_ERROR, "Password cannot be empty when password protection is enabled"))
      return false
    }

    return true
  }

  const handleSave = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      if (!validateSettings()) {
        setIsSubmitting(false)
        return
      }

      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update user name if changed
      if (displayName !== userName) {
        onUpdateUserName(displayName)
      }

      onUpdate({
        name: roomName,
        inviteCode,
        maxParticipants,
        password: passwordEnabled ? password : undefined,
      })
    } catch (err) {
      setError(createError(ErrorCode.UNKNOWN_ERROR, "Failed to update settings. Please try again."))
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
            <h2 className="text-xl font-medium">Room Settings</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {error && (
            <div className="mb-4">
              <ErrorDisplay error={error} onDismiss={() => setError(null)} />
            </div>
          )}

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black/30 backdrop-blur-sm">
              <TabsTrigger value="profile" className="data-[state=active]:bg-white/10">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-white/10">
                <Shield className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="room" className="data-[state=active]:bg-white/10">
                <Users className="mr-2 h-4 w-4" />
                Room
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display-name" className="text-sm font-medium">
                  Display Name
                </Label>
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="border-white/10 bg-black/40 text-white backdrop-blur-sm"
                  placeholder="Your display name"
                />
                <p className="text-xs text-zinc-500">This is how others will see you in the chat</p>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-4 space-y-4">
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
                    className="border-white/10 bg-black/40 text-zinc-400 hover:text-white backdrop-blur-sm"
                    onClick={() => copyToClipboard(inviteCode)}
                  >
                    <Copy className={cn("h-4 w-4", copied && "text-white")} />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="password-toggle" className="text-sm font-medium">
                      Password Protection
                    </Label>
                    <Lock className="h-4 w-4 text-zinc-500" />
                  </div>
                  <Switch id="password-toggle" checked={passwordEnabled} onCheckedChange={setPasswordEnabled} />
                </div>

                {passwordEnabled && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-zinc-400 hover:text-white"
                        onClick={generatePassword}
                      >
                        <RefreshCw className="mr-1 h-3 w-3" />
                        <span className="text-xs">Regenerate</span>
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-white/10 bg-black/40 text-white backdrop-blur-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-white/10 bg-black/40 text-zinc-400 hover:text-white backdrop-blur-sm"
                        onClick={() => copyToClipboard(password)}
                      >
                        <Copy className={cn("h-4 w-4", copied && "text-white")} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="room" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="room-name" className="text-sm font-medium">
                  Room Name
                </Label>
                <Input
                  id="room-name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="border-white/10 bg-black/40 text-white backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Max Participants</Label>
                  <span className="text-sm font-medium">{maxParticipants === 50 ? "∞" : maxParticipants}</span>
                </div>
                <Slider
                  value={[maxParticipants]}
                  min={2}
                  max={50}
                  step={1}
                  onValueChange={(value) => setMaxParticipants(value[0])}
                  className="py-2"
                />
                <p className="text-xs text-zinc-500">
                  {maxParticipants === 50
                    ? "Unlimited participants can join"
                    : `Up to ${maxParticipants} people can join`}
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6">
            <GlassButton variant="default" onClick={onClose}>
              Cancel
            </GlassButton>
            <GlassButton variant="solid" onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </GlassButton>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
