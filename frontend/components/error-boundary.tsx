"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to an error reporting service
    console.error("Error caught by boundary:", error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex h-full min-h-[200px] w-full flex-col items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 p-6 text-center"
        >
          <div className="mb-4 rounded-full bg-zinc-800 p-3">
            <RefreshCw className="h-6 w-6 text-zinc-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-white">Something went wrong</h3>
          <p className="mb-4 max-w-md text-sm text-zinc-400">
            {this.state.error?.message || "We hit an unexpected bump. Let's refresh and try again."}
          </p>
          <Button onClick={this.handleReset} className="bg-white text-black hover:bg-zinc-200">
            Refresh
          </Button>
        </motion.div>
      )
    }

    return this.props.children
  }
}
