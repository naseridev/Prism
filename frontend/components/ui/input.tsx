"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  glassmorphic?: boolean
}

/**
 * Input component with optional glassmorphism styling
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, glassmorphic = true, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          glassmorphic && "border-white/10 bg-black/40 text-white backdrop-blur-sm placeholder:text-zinc-500",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

export { Input }
