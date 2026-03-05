import { Copy, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"

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
    <header className="flex items-center justify-between bg-zinc-900/80 px-6 py-3 backdrop-blur-sm">
      {/* Sidebar trigger + Brand */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-zinc-400 hover:text-white hover:bg-zinc-800" />
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="BookMind GPT" className="h-10 w-10 rounded-lg object-contain" />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight text-white">BookMind GPT</span>
            <span className="text-[11px] text-zinc-500">Agentic assistant</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">

        {/* Clear */}
        <Button
          size="icon-sm"
          variant="ghost"
          title="New chat"
          onClick={onClear}
          className="text-zinc-400 hover:text-white hover:bg-zinc-800"
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
          className="text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
        >
          <Copy className="h-4 w-4" />
        </Button>

        {/* Status badge */}
        <div className="flex items-center gap-1.5 rounded-full bg-zinc-900 border border-zinc-700/60 px-2.5 py-1">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isGenerating ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
            }`}
          />
          <span className="text-[11px] font-medium text-zinc-400">
            {isGenerating ? "Generating" : "Ready"}
          </span>
        </div>
      </div>
    </header>
  )
}
