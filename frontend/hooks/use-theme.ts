"use client"

import { useState, useEffect } from "react"

type Theme = "dark" | "light" | "system"

/**
 * Custom hook for managing theme preferences
 * Follows Silicon Valley standards for theme management
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    // Load theme from localStorage if available
    const savedTheme = localStorage.getItem("prism-theme") as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("prism-theme", newTheme)

    // Apply theme to document
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      document.documentElement.classList.toggle("dark", systemTheme === "dark")
    } else {
      document.documentElement.classList.toggle("dark", newTheme === "dark")
    }
  }

  // Listen for system theme changes if using system theme
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle("dark", e.matches)
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])

  return { theme, updateTheme }
}
