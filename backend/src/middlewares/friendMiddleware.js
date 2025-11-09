import Conversation from "../models/Conversation.js"
import Friend from "../models/Friend.js"

export const pair = (a, b) => (a > b ? [a, b] : [b, a])

export const checkFriendShip = async (req, res, next) => {
  try {
    const me = req.user._id.toString()
    const recipientId = req.body?.recipientId ?? null

    if (recipientId) {
      const [userA, userB] = pair(me, recipientId)

      const isFriend  = await Friend.findOne({ userA, userB })

      if (!isFriend) {
        return res.status(403).json({ message: 'Không thể gửi tin nhắn khi chưa kết bạn' })
      }
      return next()
    }

    if (!recipientId) return res.status(400).json({ message: 'Không tìm thấy người nhận' })

    // Ghi chú: chat nhóm
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi kiểm tra bạn bè' })
  }
}