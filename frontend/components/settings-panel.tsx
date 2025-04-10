"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Moon, Sun, Volume2, Volume1, VolumeX, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Standard easing function used by Meta and other Silicon Valley companies
const STANDARD_EASE = [0.25, 0.1, 0.25, 1]
const ANIMATION_DURATION = 0.15

export default function SettingsPanel({ onClose }: { onClose: () => void }) {
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark")
  const [notifications, setNotifications] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [volume, setVolume] = useState(80)
  const [messagePreview, setMessagePreview] = useState(true)
  const [autoReply, setAutoReply] = useState(false)
  const [fontSize, setFontSize] = useState(16)

  return (
    <motion.div
      className="rounded-lg border border-zinc-800 bg-black p-6"
      initial={{ y: 10 }}
      animate={{ y: 0 }}
      transition={{ duration: ANIMATION_DURATION, ease: STANDARD_EASE }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-medium">Prism Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:text-white">
          <X size={20} />
        </Button>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-900">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="mt-4 space-y-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Theme</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 ${theme === "dark" ? "bg-white text-black" : "bg-zinc-900"}`}
                onClick={() => setTheme("dark")}
              >
                <Moon size={16} />
                <span>Dark</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 ${theme === "light" ? "bg-white text-black" : "bg-zinc-900"}`}
                onClick={() => setTheme("light")}
              >
                <Sun size={16} />
                <span>Light</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 ${theme === "system" ? "bg-white text-black" : "bg-zinc-900"}`}
                onClick={() => setTheme("system")}
              >
                <Monitor size={16} />
                <span>System</span>
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Enable Notifications</h3>
              <p className="text-xs text-zinc-500">Receive notifications for new messages</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Message Preview</h3>
              <p className="text-xs text-zinc-500">Show message content in notifications</p>
            </div>
            <Switch checked={messagePreview} onCheckedChange={setMessagePreview} disabled={!notifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Sound Effects</h3>
              <p className="text-xs text-zinc-500">Play sounds for new messages</p>
            </div>
            <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Volume</h3>
              <span className="text-xs text-zinc-500">{volume}%</span>
            </div>
            <div className="flex items-center gap-2">
              {volume === 0 ? (
                <VolumeX size={16} className="text-zinc-500" />
              ) : volume < 50 ? (
                <Volume1 size={16} className="text-zinc-500" />
              ) : (
                <Volume2 size={16} className="text-zinc-500" />
              )}
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0])}
                disabled={!soundEnabled}
                className="flex-1"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="accessibility" className="mt-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Font Size</h3>
              <span className="text-xs text-zinc-500">{fontSize}px</span>
            </div>
            <Slider
              value={[fontSize]}
              min={12}
              max={24}
              step={1}
              onValueChange={(value) => setFontSize(value[0])}
              className="flex-1"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Auto Reply</h3>
              <p className="text-xs text-zinc-500">Automatically reply to messages when away</p>
            </div>
            <Switch checked={autoReply} onCheckedChange={setAutoReply} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button className="bg-white text-black hover:bg-zinc-200" onClick={onClose}>
          Save Changes
        </Button>
      </div>
    </motion.div>
  )
}
