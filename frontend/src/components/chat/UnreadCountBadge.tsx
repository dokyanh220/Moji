import { Badge } from "lucide-react"

const UnreadCountBadge = ({ unreadCount }: { unreadCount: number }) => {
  if (unreadCount <= 0) return null

  return (
    <div className="absolute -top-1 -right-1 z-20">
      <span className="
        min-w-[18px] h-[18px]
        px-1
        flex items-center justify-center
        rounded-full
        text-[12px] font-bold
        text-white
        bg-[red]
        border border-background
      ">
        {unreadCount > 9 ? "9+" : unreadCount}
      </span>
    </div>
  )
}


export default UnreadCountBadge