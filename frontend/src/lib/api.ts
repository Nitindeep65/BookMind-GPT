const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8001/api"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UploadResult {
  message: string
  filename: string
  chunks: number
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface ChatResult {
  answer: string
  sources: string[]
}

// ── API helpers ───────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = `HTTP ${res.status}`
    try {
      const body = await res.json()
      detail = body?.detail ?? detail
    } catch {
      // ignore parse error
    }
    throw new Error(detail)
  }
  return res.json() as Promise<T>
}

/**
 * Upload a PDF to the backend for extraction, chunking, and indexing.
 */
export async function uploadPDF(file: File): Promise<UploadResult> {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  })

  return handleResponse<UploadResult>(res)
}

/**
 * Send the full conversation history to the backend.
 * The backend retrieves relevant context and generates an LLM reply.
 */
export async function sendChat(messages: ChatMessage[]): Promise<ChatResult> {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  })

  return handleResponse<ChatResult>(res)
}
