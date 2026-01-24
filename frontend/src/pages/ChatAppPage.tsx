import { AppSidebar } from "@/components/sidebar/app-sidebar"
import ChatWindowLayout from "@/components/chat/ChatWindowLayout"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores/useAuthStore"

const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user)

  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="flex h-screen w-full p-2">
        <ChatWindowLayout />
      </div>
    </SidebarProvider>
  )
}

export default ChatAppPage
