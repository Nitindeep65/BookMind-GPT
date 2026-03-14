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
  currentUser?: {
    name?: string
    email?: string
  } | null
}

export function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  currentUser = null,
}: ChatSidebarProps) {
  const userInitial = currentUser?.name?.trim()?.charAt(0)?.toUpperCase() || "G"
  const isLoggedIn = Boolean(currentUser?.name || currentUser?.email)

  const today = conversations.filter(
    (c) => new Date().toDateString() === c.createdAt.toDateString()
  )
  const older = conversations.filter(
    (c) => new Date().toDateString() !== c.createdAt.toDateString()
  )

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border/70 bg-sidebar/85 *:data-[slot=sidebar]:border-r-0"
    >
      {/* Brand / logo */}
      <SidebarHeader className="px-3 py-3">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="BookMind GPT" className="h-10 w-10 shrink-0 rounded-lg object-contain" />
          <span className="truncate text-sm font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            BookMind GPT
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        {/* New chat button */}
        <div className="mb-2 px-1 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          <Button
            onClick={onNew}
            variant="ghost"
            className="w-full justify-start gap-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          >
            <MessageSquarePlus className="h-4 w-4 shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">New chat</span>
          </Button>
        </div>

        {/* Today */}
        {today.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground group-data-[collapsible=icon]:hidden">
              Today
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {today.map((conv) => (
                  <SidebarMenuItem key={conv.id}>
                    <SidebarMenuButton
                      isActive={conv.id === activeId}
                      onClick={() => onSelect(conv.id)}
                      className="group/item text-sidebar-foreground/80 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground"
                      tooltip={conv.title}
                    >
                      <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate text-xs">{conv.title}</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      onClick={() => onDelete(conv.id)}
                      className="text-muted-foreground opacity-0 group-hover/item:opacity-100 hover:text-destructive group-data-[collapsible=icon]:hidden"
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
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground group-data-[collapsible=icon]:hidden">
              Earlier
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {older.map((conv) => (
                  <SidebarMenuItem key={conv.id}>
                    <SidebarMenuButton
                      isActive={conv.id === activeId}
                      onClick={() => onSelect(conv.id)}
                      className="group/item text-sidebar-foreground/80 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground"
                      tooltip={conv.title}
                    >
                      <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate text-xs">{conv.title}</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      onClick={() => onDelete(conv.id)}
                      className="text-muted-foreground opacity-0 group-hover/item:opacity-100 hover:text-destructive group-data-[collapsible=icon]:hidden"
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
            <MessageSquare className="h-8 w-8 text-muted-foreground/70" />
            <p className="text-xs text-muted-foreground">No conversations yet</p>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="h-auto py-2 hover:bg-accent data-[state=open]:bg-accent"
                  tooltip="Profile"
                >
                  {/* Avatar */}
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {userInitial}
                  </div>
                  <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
                    <span className="truncate text-xs font-semibold text-foreground">
                      {isLoggedIn ? currentUser?.name : "Guest session"}
                    </span>
                    {isLoggedIn && currentUser?.email ? (
                      <span className="truncate text-[10px] text-muted-foreground">{currentUser.email}</span>
                    ) : null}
                  </div>
                  <ChevronsUpDown className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-56"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-2.5 py-1">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {userInitial}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-foreground">
                        {isLoggedIn ? currentUser?.name : "Guest session"}
                      </span>
                      {isLoggedIn && currentUser?.email ? (
                        <span className="text-[11px] text-muted-foreground">{currentUser.email}</span>
                      ) : null}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isLoggedIn ? (
                  <>
                    <DropdownMenuItem className="cursor-pointer gap-2 text-xs">
                      <User className="h-3.5 w-3.5" />
                      View profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer gap-2 text-xs font-medium text-primary">
                      <Sparkles className="h-3.5 w-3.5" />
                      Upgrade plan
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem className="cursor-pointer gap-2 text-xs">
                    <Sparkles className="h-3.5 w-3.5" />
                    Sign in to save chats
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2 text-xs">
                  <Palette className="h-3.5 w-3.5" />
                  Personalization
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2 text-xs">
                  <Settings className="h-3.5 w-3.5" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2 text-xs">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Help & support
                </DropdownMenuItem>
                {isLoggedIn ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer gap-2 text-xs" variant="destructive">
                      <LogOut className="h-3.5 w-3.5" />
                      Sign out
                    </DropdownMenuItem>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
