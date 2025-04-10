"use client"

import { useState, useCallback } from "react"
import { type AppError, ErrorCode, createError } from "@/types"

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: AppError | null
}

type AsyncFunction<T, A extends any[]> = (...args: A) => Promise<T>

export function useAsync<T, A extends any[]>(asyncFunction: AsyncFunction<T, A>) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (...args: A) => {
      setState({ data: null, loading: true, error: null })
      try {
        const data = await asyncFunction(...args)
        setState({ data, loading: false, error: null })
        return { data, error: null }
      } catch (error) {
        const appError =
          error instanceof Error
            ? createError(ErrorCode.UNKNOWN_ERROR, error.message)
            : createError(ErrorCode.UNKNOWN_ERROR, "An unknown error occurred")

        setState({ data: null, loading: false, error: appError })
        return { data: null, error: appError }
      }
    },
    [asyncFunction],
  )

  return { ...state, execute }
}
