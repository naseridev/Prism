"use client"

import { useState, useEffect } from "react"
import ChatInterface from "@/components/chat-interface"
import LoadingChat from "@/components/loading-chat"

/**
 * Main application entry point
 * Follows Silicon Valley standards for component structure
 */
export default function Home() {
  const [loading, setLoading] = useState(true)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="h-screen w-full overflow-hidden">
      {loading ? <LoadingChat /> : <ChatInterface />}
    </main>
  )
}
