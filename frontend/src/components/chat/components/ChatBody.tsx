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

const QUICK_START_PROMPTS = [
  "Summarize the most important ideas from my uploaded document.",
  "Give me 5 key takeaways with short explanations.",
  "Create 10 interview questions from this material.",
  "Explain this content in simple language for a beginner.",
]

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
      <div className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden px-4 pb-4 pt-3 sm:px-6">
        {isEmpty && (
          <div className="mb-5 flex flex-col items-center justify-center gap-3 pt-8">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              BookMind GPT Workspace
            </span>
            <div className="flex w-full max-w-3xl flex-wrap justify-center gap-2">
              {QUICK_START_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => append({ role: "user", content: prompt })}
                  className="rounded-full border border-border/80 bg-card/80 px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
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
          className="h-full rounded-2xl border border-border/70 bg-card/60 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm sm:p-4 dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
        />
      </div>
    </div>
  )
}
