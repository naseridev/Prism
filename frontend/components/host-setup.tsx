"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowLeft, RefreshCw, Copy, Info } from "lucide-react"
import { cn } from "@/lib/utils"

// Standard easing function used by Meta and other Silicon Valley companies
const STANDARD_EASE = [0.25, 0.1, 0.25, 1]
const ANIMATION_DURATION = 0.15

interface HostSetupProps {
  onSetup: (data: {
    inviteCode: string
    password?: string
    maxParticipants: number
    selfDestructTime?: number
  }) => void
  onBack: () => void
}

export default function HostSetup({ onSetup, onBack }: HostSetupProps) {
  const [inviteCode, setInviteCode] = useState("")
  const [passwordEnabled, setPasswordEnabled] = useState(false)
  const [password, setPassword] = useState("")
  const [maxParticipants, setMaxParticipants] = useState(10)
  const [selfDestruct, setSelfDestruct] = useState(false)
  const [selfDestructTime, setSelfDestructTime] = useState(24)
  const [copied, setCopied] = useState(false)

  // Generate random invite code on mount
  useEffect(() => {
    generateInviteCode()
  }, [])

  const generateInviteCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    setInviteCode(code)
  }

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(result)
  }

  useEffect(() => {
    if (passwordEnabled && !password) {
      generatePassword()
    }
  }, [passwordEnabled])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCreateRoom = () => {
    onSetup({
      inviteCode,
      password: passwordEnabled ? password : undefined,
      maxParticipants,
      selfDestructTime: selfDestruct ? selfDestructTime : undefined,
    })
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900 text-white">
      <CardHeader>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 text-zinc-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <CardTitle className="text-xl font-medium">Host a Chat Room</CardTitle>
            <CardDescription className="text-zinc-400">Configure your secure chat room</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="invite-code" className="text-sm font-medium">
              Invite Code
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-zinc-400 hover:text-white"
                    onClick={generateInviteCode}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate new code</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-2">
            <Input
              id="invite-code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="border-zinc-700 bg-zinc-800 text-white"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white"
                    onClick={() => copyToClipboard(inviteCode)}
                  >
                    <Copy className={cn("h-4 w-4", copied && "text-white")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{copied ? "Copied!" : "Copy code"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-zinc-500">Share this code with people you want to invite</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="password-toggle" className="text-sm font-medium">
                Password Protection
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-zinc-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add an extra layer of security</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch id="password-toggle" checked={passwordEnabled} onCheckedChange={setPasswordEnabled} />
          </div>

          {passwordEnabled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-zinc-400 hover:text-white"
                        onClick={generatePassword}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Generate new password</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex gap-2">
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-zinc-700 bg-zinc-800 text-white"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white"
                        onClick={() => copyToClipboard(password)}
                      >
                        <Copy className={cn("h-4 w-4", copied && "text-white")} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copied ? "Copied!" : "Copy password"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Max Participants</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-zinc-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Limit the number of people who can join</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-sm font-medium">{maxParticipants}</span>
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
            {maxParticipants === 50 ? "Unlimited participants can join" : `Up to ${maxParticipants} people can join`}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="self-destruct" className="text-sm font-medium">
                Self-Destruct Timer
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-zinc-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Room will automatically close after this time</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch id="self-destruct" checked={selfDestruct} onCheckedChange={setSelfDestruct} />
          </div>

          {selfDestruct && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Time Limit</Label>
                <span className="text-sm font-medium">
                  {selfDestructTime} {selfDestructTime === 1 ? "hour" : "hours"}
                </span>
              </div>
              <Slider
                value={[selfDestructTime]}
                min={1}
                max={72}
                step={1}
                onValueChange={(value) => setSelfDestructTime(value[0])}
                className="py-2"
              />
              <p className="text-xs text-zinc-500">
                Room will close after {selfDestructTime} {selfDestructTime === 1 ? "hour" : "hours"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-white text-black hover:bg-zinc-200" onClick={handleCreateRoom}>
          Create Room
        </Button>
      </CardFooter>
    </Card>
  )
}
