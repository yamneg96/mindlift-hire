import { z } from "zod"

import { useAppStore } from "@/store/app-store"
import { apiEnvelopeSchema } from "@/lib/api/schemas"

const rawApiBase =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "https://mindlift-backend.vercel.com/api"

const normalizedApiBase = rawApiBase.replace(/\/+$/, "")

const API_BASE = /\/api$/i.test(normalizedApiBase)
  ? normalizedApiBase
  : `${normalizedApiBase}/api`

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE"
  body?: unknown
  isFormData?: boolean
  signal?: AbortSignal
}

export async function apiRequest<T extends z.ZodTypeAny>(
  path: string,
  schema: T,
  options: RequestOptions = {}
): Promise<z.infer<T>> {
  const token = useAppStore.getState().token

  const headers = new Headers()
  if (!options.isFormData) {
    headers.set("Content-Type", "application/json")
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body
      ? options.isFormData
        ? (options.body as FormData)
        : JSON.stringify(options.body)
      : undefined,
    signal: options.signal,
  })

  const json = await response.json()
  if (!response.ok) {
    throw new Error(json?.message ?? "Request failed")
  }

  const parsed = apiEnvelopeSchema(schema).parse(json) as {
    success: boolean
    message?: string
    data: z.infer<T>
  }
  return parsed.data
}

export { API_BASE }
