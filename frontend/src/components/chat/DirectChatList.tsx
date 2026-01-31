
import { useChatStore } from '@/stores/useChatStore'
import DirectMessageCard from './DirectMessageCard'

const DirectChatList = () => {
  const { conversations } = useChatStore()

  if (!conversations) return

  const directConversation = conversations.filter((convo) => convo.type === "direct")

  return (
    <div className='flex-1 overflow-y-auto p-2 space-y-2'>
      {directConversation.map(convo => (
        <DirectMessageCard
          key={convo._id}
          convo={convo}
        />
      ))}
    </div>
  )
}

export default DirectChatList