import { Copy, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/ui/mode-toggle"

interface ChatHeaderProps {
  isGenerating: boolean
  copied: boolean
  onCopy: () => void
  onClear: () => void
  hasMessages: boolean
}

export function ChatHeader({
  isGenerating,
  copied,
  onCopy,
  onClear,
  hasMessages,
}: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/70 bg-background/85 px-3 py-2.5 sm:px-6 sm:py-3 backdrop-blur-md">
      {/* Sidebar trigger + Brand */}
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:bg-accent hover:text-accent-foreground" />
        <div className="flex min-w-0 items-center gap-2">
          <img src="/logo.png" alt="BookMind GPT" className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl object-contain ring-1 ring-border/60" />
          <div className="flex min-w-0 flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight text-foreground">BookMind GPT</span>
            <span className="hidden sm:block text-[11px] text-muted-foreground">Document-grounded assistant</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="hidden md:flex items-center gap-1.5 rounded-full border border-border/70 bg-card/70 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span className="text-[11px] font-medium text-muted-foreground">PDF Mode</span>
        </div>

        <ModeToggle />

        {/* Clear */}
        <Button
          size="icon-sm"
          variant="ghost"
          title="New chat"
          onClick={onClear}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        {/* Copy */}
        <Button
          size="icon-sm"
          variant="ghost"
          title={copied ? "Copied!" : "Copy conversation"}
          onClick={onCopy}
          disabled={!hasMessages}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-30"
        >
          <Copy className="h-4 w-4" />
        </Button>

        {/* Status badge */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-border/80 bg-card/80 px-2.5 py-1">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isGenerating ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
            }`}
          />
          <span className="text-[11px] font-medium text-muted-foreground">
            {isGenerating ? "Generating" : "Ready"}
          </span>
        </div>
      </div>
    </header>
  )
}
