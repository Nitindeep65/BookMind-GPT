import { MessageSquarePlus, Trash2, MessageSquare, ChevronsUpDown, Settings, LogOut, User, Sparkles, Palette, HelpCircle } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export interface Conversation {
  id: string
  title: string
  createdAt: Date
}

interface ChatSidebarProps {
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
}

export function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: ChatSidebarProps) {
  const today = conversations.filter(
    (c) => new Date().toDateString() === c.createdAt.toDateString()
  )
  const older = conversations.filter(
    (c) => new Date().toDateString() !== c.createdAt.toDateString()
  )

  return (
    <Sidebar collapsible="icon" className="bg-zinc-900 *:data-[slot=sidebar]:border-r-0" style={{ background: '#18181b' }}>
      {/* Brand / logo */}
      <SidebarHeader className="bg-zinc-900 px-3 py-3">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="BookMind GPT" className="h-10 w-10 shrink-0 rounded-lg object-contain" />
          <span className="truncate text-sm font-semibold text-white group-data-[collapsible=icon]:hidden">
            BookMind GPT
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-zinc-900 px-2 py-2">
        {/* New chat button */}
        <div className="mb-2 px-1 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          <Button
            onClick={onNew}
            variant="ghost"
            className="w-full justify-start gap-2 text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          >
            <MessageSquarePlus className="h-4 w-4 shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">New chat</span>
          </Button>
        </div>

        {/* Today */}
        {today.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-zinc-600 group-data-[collapsible=icon]:hidden">
              Today
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {today.map((conv) => (
                  <SidebarMenuItem key={conv.id}>
                    <SidebarMenuButton
                      isActive={conv.id === activeId}
                      onClick={() => onSelect(conv.id)}
                      className="group/item text-zinc-300 data-[active=true]:bg-zinc-800 data-[active=true]:text-white hover:bg-zinc-800 hover:text-white"
                      tooltip={conv.title}
                    >
                      <MessageSquare className="h-4 w-4 shrink-0 text-zinc-500" />
                      <span className="truncate text-xs">{conv.title}</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      onClick={() => onDelete(conv.id)}
                      className="opacity-0 group-hover/item:opacity-100 text-zinc-600 hover:text-red-400 group-data-[collapsible=icon]:hidden"
                      showOnHover
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Older */}
        {older.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-zinc-600 group-data-[collapsible=icon]:hidden">
              Earlier
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {older.map((conv) => (
                  <SidebarMenuItem key={conv.id}>
                    <SidebarMenuButton
                      isActive={conv.id === activeId}
                      onClick={() => onSelect(conv.id)}
                      className="group/item text-zinc-300 data-[active=true]:bg-zinc-800 data-[active=true]:text-white hover:bg-zinc-800 hover:text-white"
                      tooltip={conv.title}
                    >
                      <MessageSquare className="h-4 w-4 shrink-0 text-zinc-500" />
                      <span className="truncate text-xs">{conv.title}</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      onClick={() => onDelete(conv.id)}
                      className="opacity-0 group-hover/item:opacity-100 text-zinc-600 hover:text-red-400 group-data-[collapsible=icon]:hidden"
                      showOnHover
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {conversations.length === 0 && (
          <div className="mt-8 flex flex-col items-center gap-2 text-center group-data-[collapsible=icon]:hidden">
            <MessageSquare className="h-8 w-8 text-zinc-700" />
            <p className="text-xs text-zinc-600">No conversations yet</p>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="bg-zinc-900 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="h-auto py-2 hover:bg-zinc-800 data-[state=open]:bg-zinc-800"
                  tooltip="Profile"
                >
                  {/* Avatar */}
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-700 text-xs font-bold text-white">
                    N
                  </div>
                  <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
                    <span className="truncate text-xs font-semibold text-zinc-200">Nitin</span>
                    <span className="truncate text-[10px] text-zinc-500">nitin@example.com</span>
                  </div>
                  <ChevronsUpDown className="ml-auto h-3.5 w-3.5 shrink-0 text-zinc-500 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-56 border-zinc-800 bg-zinc-900 text-zinc-200"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-2.5 py-1">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-700 text-sm font-bold text-white">
                      N
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-zinc-100">Nitin</span>
                      <span className="text-[11px] text-zinc-500">nittin@example.com</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="gap-2 text-xs text-zinc-300 hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white cursor-pointer">
                  <User className="h-3.5 w-3.5" />
                  View profile
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-xs cursor-pointer font-medium text-indigo-400 hover:bg-zinc-800 focus:bg-zinc-800 focus:text-indigo-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Upgrade plan
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="gap-2 text-xs text-zinc-300 hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white cursor-pointer">
                  <Palette className="h-3.5 w-3.5" />
                  Personalization
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-xs text-zinc-300 hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white cursor-pointer">
                  <Settings className="h-3.5 w-3.5" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-xs text-zinc-300 hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white cursor-pointer">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Help & support
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="gap-2 text-xs text-red-400 hover:bg-zinc-800 focus:bg-zinc-800 focus:text-red-400 cursor-pointer">
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
