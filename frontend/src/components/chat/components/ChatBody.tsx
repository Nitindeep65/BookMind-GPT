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
  "Summarize the key ideas from my uploaded PDF in 6 bullet points.",
  "List the most important arguments from this PDF with page references.",
  "Create 10 quiz questions and answers using only this uploaded document.",
  "Explain this PDF in beginner-friendly language without adding outside facts.",
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
      <div className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden px-2 pb-3 pt-2 sm:px-6 sm:pb-4 sm:pt-3">
        {isEmpty && (
          <div className="mb-4 rounded-2xl border border-border/70 bg-card/60 px-3 py-4 sm:mb-5 sm:px-5 sm:py-6">
            <div className="mb-4 flex flex-col items-center justify-center gap-1.5 text-center sm:mb-5">
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.16em] sm:tracking-[0.18em] text-muted-foreground">
                Ask About Your Uploaded PDF
              </span>
              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                Start with a focused question
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Your answers are generated from the document you uploaded.
              </p>
            </div>

            <div className="grid w-full gap-2 sm:gap-3 sm:grid-cols-2">
              {QUICK_START_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => append({ role: "user", content: prompt })}
                  className="rounded-xl border border-border/80 bg-background/70 px-3 py-2.5 text-left text-[12px] sm:text-[13px] text-muted-foreground transition hover:border-primary/40 hover:bg-accent hover:text-accent-foreground"
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
          className="h-full rounded-xl sm:rounded-2xl border border-border/70 bg-card/60 p-2 sm:p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
        />
      </div>
    </div>
  )
}
