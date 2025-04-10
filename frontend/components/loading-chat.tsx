import { Loader2 } from "lucide-react"

export default function LoadingChat() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <p className="text-sm text-zinc-400">Loading chat interface...</p>
      </div>
    </div>
  )
}
