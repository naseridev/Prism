"use client"
import { X, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassCard } from "@/components/ui/glass-card"
import UserAvatar from "./user-avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Participant, RoomData } from "@/types"

interface SidebarProps {
  onClose: () => void
  participants: Participant[]
  roomData: RoomData | null
  onCreateRoom: () => void
}

/**
 * Sidebar component for displaying room information and participants
 */
export default function Sidebar({ onClose, participants, roomData, onCreateRoom }: SidebarProps) {
  return (
    <GlassCard className="flex h-full w-72 flex-col" intensity="medium">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <h2 className="text-xl font-medium tracking-tight">Prism</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:text-white md:hidden">
          <X size={20} />
        </Button>
      </div>

      <GlassButton variant="outline" className="mx-4 mt-4 flex items-center gap-2" onClick={onCreateRoom}>
        <Shield className="h-4 w-4" />
        <span>{roomData ? "New Room" : "Create Room"}</span>
      </GlassButton>

      {roomData ? (
        <Tabs defaultValue="participants" className="mt-4 flex-1">
          <TabsList className="grid w-full grid-cols-2 bg-black/30 backdrop-blur-sm">
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="info">Room Info</TabsTrigger>
          </TabsList>

          <TabsContent value="participants" className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {participants.map((participant) => (
                <GlassCard
                  key={participant.id}
                  className="flex items-center gap-3 rounded-md p-2 hover:bg-white/5 transition-colors"
                  intensity="low"
                  border={false}
                >
                  <UserAvatar name={participant.name} className="h-8 w-8" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{participant.name}</p>
                      {participant.isHost && (
                        <GlassCard className="rounded-full px-2 py-0.5 text-xs text-white" intensity="low">
                          Host
                        </GlassCard>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="info" className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium">Room Name</h3>
                <GlassCard className="flex items-center gap-2 rounded-md p-2" intensity="low">
                  <span className="text-sm">{roomData.name}</span>
                </GlassCard>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Invite Code</h3>
                <GlassCard className="flex items-center gap-2 rounded-md p-2" intensity="low">
                  <Shield className="h-4 w-4 text-white" />
                  <span className="text-sm">{roomData.inviteCode}</span>
                </GlassCard>
              </div>

              {roomData.password && (
                <div>
                  <h3 className="mb-2 text-sm font-medium">Password</h3>
                  <GlassCard className="flex items-center gap-2 rounded-md p-2" intensity="low">
                    <span className="text-sm">••••••••</span>
                  </GlassCard>
                </div>
              )}

              <div>
                <h3 className="mb-2 text-sm font-medium">Participants</h3>
                <GlassCard className="flex items-center gap-2 rounded-md p-2" intensity="low">
                  <Users className="h-4 w-4 text-white" />
                  <span className="text-sm">
                    {participants.length} / {roomData.maxParticipants === 50 ? "∞" : roomData.maxParticipants}
                  </span>
                </GlassCard>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="mt-8 flex flex-1 flex-col items-center justify-center p-4 text-center">
          <Shield className="mb-4 h-12 w-12 text-zinc-700" />
          <h3 className="mb-2 text-lg font-medium">No Active Room</h3>
          <p className="text-sm text-zinc-500">Create a room to start chatting securely</p>
        </div>
      )}

      <div className="border-t border-white/10 p-4">
        <p className="text-center text-xs text-zinc-500">End-to-end encrypted messaging</p>
      </div>
    </GlassCard>
  )
}
