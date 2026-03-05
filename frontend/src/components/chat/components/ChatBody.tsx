import { Chat } from "@/components/ui/chat"
import { type Message } from "@/components/ui/chat-message"

interface ChatBodyProps {
  messages: Message[]
  setMessages: (messages: Message[]) => void
  input: string
  handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement>
  handleSubmit: (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList }
  ) => void
  append: (message: { role: "user"; content: string }) => void
  stop: () => void
  isGenerating: boolean
}

export function ChatBody({
  messages,
  setMessages,
  input,
  handleInputChange,
  handleSubmit,
  append,
  stop,
  isGenerating,
}: ChatBodyProps) {
  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="mx-auto flex w-full max-w-3xl flex-col overflow-hidden py-2 px-4 pb-4">
        {isEmpty && (
          <div className="mb-4 flex items-center justify-center gap-1.5 pt-8">
            <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              BookMind GPT
            </span>
          </div>
        )}

        <Chat
          messages={messages}
          handleSubmit={handleSubmit}
          input={input}
          handleInputChange={handleInputChange}
          isGenerating={isGenerating}
          stop={stop}
          append={append}
          suggestions={[]}
          setMessages={setMessages}
          className="h-full"
        />
      </div>
    </div>
  )
}
