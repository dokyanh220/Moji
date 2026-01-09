import Conversation from "../models/Conversation.js"
import Friend from "../models/Friend.js"

export const pair = (a, b) => (a > b ? [a, b] : [b, a])

export const checkFriendShip = async (req, res, next) => {
  try {
    const me = req.user._id.toString();
    const recipientId = req.body?.recipientId ?? null;
    const memberIds = req.body?.memberIds ?? [];

    if (!recipientId && memberIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Cần cung cấp recipientId hoặc memberIds" });
    }

    if (recipientId) {
      const isFriend = await Friend.findOne({
        $or: [
          { userA: me, userB: recipientId },
          { userA: recipientId, userB: me }
        ]
       });

      if (!isFriend) {
        return res.status(403).json({ message: "Bạn chưa kết bạn với người này" });
      }

      return next();
    }

    const friendChecks = memberIds.map(async (memberId) => {
      const friend = await Friend.findOne({
        $or: [
          { userA: me, userB: memberId },
          { userA: memberId, userB: me }
        ]
      });
      return friend ? null : memberId;
    });

    const results = await Promise.all(friendChecks);
    const notFriends = results.filter(Boolean);

    if (notFriends.length > 0) {
      return res
        .status(403)
        .json({ message: "Bạn chỉ có thể thêm bạn bè vào nhóm.", notFriends });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi kiểm tra bạn bè' })
  }
}