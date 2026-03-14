import { useState, useCallback, useEffect } from "react"
import { type Message } from "@/components/ui/chat-message"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ChatHeader } from "./components/ChatHeader"
import { ChatBody } from "./components/ChatBody"
import { ChatSidebar, type Conversation } from "./components/ChatSidebar"
import { sendChat } from "@/lib/api"

type ConversationStore = Record<string, Message[]>

function ChatPage() {
  const [currentUser, setCurrentUser] = useState<{ name?: string; email?: string } | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [store, setStore] = useState<ConversationStore>({})
  const [activeId, setActiveId] = useState<string | null>(null)

  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const keys = ["user", "auth_user", "currentUser"]

    for (const key of keys) {
      const raw = localStorage.getItem(key)
      if (!raw) continue

      try {
        const parsed = JSON.parse(raw) as { name?: string; email?: string }
        if (parsed?.name || parsed?.email) {
          setCurrentUser({ name: parsed.name, email: parsed.email })
          return
        }
      } catch {
        // Ignore malformed localStorage entries and continue fallback checks.
      }
    }
  }, [])

  const messages: Message[] = activeId ? (store[activeId] ?? []) : []

  const setMessages = useCallback(
    (updater: Message[] | ((prev: Message[]) => Message[])) => {
      if (!activeId) return
      setStore((prev) => ({
        ...prev,
        [activeId]:
          typeof updater === "function" ? updater(prev[activeId] ?? []) : updater,
      }))
    },
    [activeId]
  )

  const handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setInput(e.target.value)
  }

  const ensureConversation = useCallback(
    (firstMessage: string): string => {
      if (activeId) return activeId
      const id = Date.now().toString()
      const conv: Conversation = {
        id,
        title: firstMessage.slice(0, 40) || "New chat",
        createdAt: new Date(),
      }
      setConversations((prev) => [conv, ...prev])
      setStore((prev) => ({ ...prev, [id]: [] }))
      setActiveId(id)
      return id
    },
    [activeId]
  )

  const sendReply = useCallback(
    async (userContent: string, convId: string, currentMessages: Message[]) => {
      setIsGenerating(true)

      // Build the history to send (all messages + the new user one)
      const history = [...currentMessages, { role: "user" as const, content: userContent }]
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content as string }))

      try {
        const result = await sendChat(history)

        const sourceLine =
          result.sources.length > 0
            ? `\n\n---\n*Sources: ${result.sources.join(", ")}*`
            : ""

        setStore((prev) => ({
          ...prev,
          [convId]: [
            ...(prev[convId] ?? []),
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: result.answer + sourceLine,
              createdAt: new Date(),
            },
          ],
        }))
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Something went wrong."
        setStore((prev) => ({
          ...prev,
          [convId]: [
            ...(prev[convId] ?? []),
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: `⚠️ ${errorMsg}`,
              createdAt: new Date(),
            },
          ],
        }))
      } finally {
        setIsGenerating(false)
      }
    },
    []
  )

  const handleSubmit = useCallback(
    (
      event?: { preventDefault?: () => void },
      options?: { experimental_attachments?: FileList }
    ) => {
      event?.preventDefault?.()
      if (!input.trim() && !options?.experimental_attachments) return
      const convId = ensureConversation(input)
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: input,
        createdAt: new Date(),
      }
      const currentMessages = store[convId] ?? []
      setStore((prev) => ({
        ...prev,
        [convId]: [...(prev[convId] ?? []), userMessage],
      }))
      const captured = input
      setInput("")
      sendReply(captured, convId, currentMessages)
    },
    [input, ensureConversation, sendReply, store]
  )

  const append = useCallback(
    (message: { role: "user"; content: string }) => {
      const convId = ensureConversation(message.content)
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: message.content,
        createdAt: new Date(),
      }
      const currentMessages = store[convId] ?? []
      setStore((prev) => ({
        ...prev,
        [convId]: [...(prev[convId] ?? []), userMessage],
      }))
      sendReply(message.content, convId, currentMessages)
    },
    [ensureConversation, sendReply, store]
  )

  const stop = useCallback(() => setIsGenerating(false), [])

  const handleCopy = () => {
    const text = messages
      .map((m) => `${m.role === "user" ? "You" : "AI"}: ${m.content}`)
      .join("\n\n")
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleNewChat = () => {
    setActiveId(null)
    setInput("")
    setIsGenerating(false)
  }

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
    setStore((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    if (activeId === id) handleNewChat()
  }

  return (
    <SidebarProvider>
      <div className="relative flex min-h-dvh w-full overflow-hidden bg-[radial-gradient(1100px_circle_at_20%_-10%,rgba(120,119,198,0.16),transparent_48%),radial-gradient(900px_circle_at_100%_0%,rgba(14,165,233,0.14),transparent_42%),var(--color-background)] text-foreground">
        <ChatSidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={(id) => { setActiveId(id); setInput(""); setIsGenerating(false) }}
          onNew={handleNewChat}
          onDelete={handleDeleteConversation}
          currentUser={currentUser}
        />
        <SidebarInset className="flex min-w-0 flex-1 flex-col bg-transparent">
          <ChatHeader
            isGenerating={isGenerating}
            copied={copied}
            onCopy={handleCopy}
            onClear={handleNewChat}
            hasMessages={messages.length > 0}
          />
          <ChatBody
            messages={messages}
            setMessages={setMessages}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            append={append}
            stop={stop}
            isGenerating={isGenerating}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default ChatPage
