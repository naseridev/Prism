"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "low" | "medium" | "high"
  border?: boolean
  children: React.ReactNode
}

/**
 * A reusable glassmorphism card component with configurable blur intensity
 */
export function GlassCard({ className, intensity = "medium", border = true, children, ...props }: GlassCardProps) {
  const blurMap = {
    low: "backdrop-blur-sm",
    medium: "backdrop-blur-md",
    high: "backdrop-blur-lg",
  }

  const bgMap = {
    low: "bg-black/30",
    medium: "",
    high: "bg-black/50",
  }

  return (
    <div
      className={cn(
        bgMap[intensity],
        "backdrop-saturate-150",
        blurMap[intensity],
        border && "border border-white/10",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
