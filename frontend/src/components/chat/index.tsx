import { useState, useCallback } from "react"
import { type Message } from "@/components/ui/chat-message"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ChatHeader } from "./components/ChatHeader"
import { ChatBody } from "./components/ChatBody"
import { ChatSidebar, type Conversation } from "./components/ChatSidebar"
import { simulateReply } from "./components/constants"

type ConversationStore = Record<string, Message[]>

function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [store, setStore] = useState<ConversationStore>({})
  const [activeId, setActiveId] = useState<string | null>(null)

  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

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
    (userContent: string, convId: string) => {
      setIsGenerating(true)
      setTimeout(() => {
        setStore((prev) => ({
          ...prev,
          [convId]: [
            ...(prev[convId] ?? []),
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: simulateReply(userContent, "BookMind GPT"),
              createdAt: new Date(),
            },
          ],
        }))
        setIsGenerating(false)
      }, 1500)
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
      setStore((prev) => ({
        ...prev,
        [convId]: [...(prev[convId] ?? []), userMessage],
      }))
      setInput("")
      sendReply(input, convId)
    },
    [input, ensureConversation, sendReply]
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
      setStore((prev) => ({
        ...prev,
        [convId]: [...(prev[convId] ?? []), userMessage],
      }))
      sendReply(message.content, convId)
    },
    [ensureConversation, sendReply]
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
      <div className="flex h-screen w-full bg-zinc-900 text-white overflow-hidden">
        <ChatSidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={(id) => { setActiveId(id); setInput(""); setIsGenerating(false) }}
          onNew={handleNewChat}
          onDelete={handleDeleteConversation}
        />
        <SidebarInset className="flex min-w-0 flex-1 flex-col bg-zinc-900">
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
