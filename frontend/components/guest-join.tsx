"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, KeyRound } from "lucide-react"

interface GuestJoinProps {
  onJoin: (data: { inviteCode: string; password?: string }) => void
  onBack: () => void
}

export default function GuestJoin({ onJoin, onBack }: GuestJoinProps) {
  const [inviteCode, setInviteCode] = useState("")
  const [password, setPassword] = useState("")
  const [passwordRequired, setPasswordRequired] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inviteCode) {
      setError("Please enter an invite code")
      return
    }

    // In a real app, you would check with the server if the room exists
    // and if it requires a password before joining

    // Simulate checking if room requires password
    if (inviteCode.length === 8) {
      setPasswordRequired(true)
      if (passwordRequired && !password) {
        setError("This room requires a password")
        return
      }
    }

    setError("")
    onJoin({
      inviteCode,
      password: password || undefined,
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
            <CardTitle className="text-xl font-medium">Join a Chat Room</CardTitle>
            <CardDescription className="text-zinc-400">Enter the room details to join</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-code" className="text-sm font-medium">
              Invite Code
            </Label>
            <Input
              id="invite-code"
              placeholder="Enter invite code"
              value={inviteCode}
              onChange={(e) => {
                setInviteCode(e.target.value.toUpperCase())
                // Simulate checking if room requires password
                setPasswordRequired(e.target.value.length === 8)
              }}
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500"
            />
            <p className="text-xs text-zinc-500">The code shared by the room host</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
              <KeyRound className="h-4 w-4" />
              <span>Password</span>
              {!passwordRequired && <span className="text-xs text-zinc-500">(if required)</span>}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={passwordRequired ? "Required" : "Optional"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 ${
                passwordRequired ? "border-white" : ""
              }`}
            />
            {passwordRequired && <p className="text-xs text-white">This room requires a password</p>}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-white text-black hover:bg-zinc-200" onClick={handleSubmit}>
          Join Room
        </Button>
      </CardFooter>
    </Card>
  )
}
