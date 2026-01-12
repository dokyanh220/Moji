import Conversation from "../models/Conversation.js";

export const createConversation = async (req, res) => {
    try {
        const { type, name, memberIds } = req.body;
        const userId = req.user._id;
        console.log("🚀 ~ createConversation ~ userId:", userId)

        if (
            !type ||
            (type == "group" && !name) ||
            !memberIds ||
            !Array.isArray(memberIds) ||
            memberIds.length == 0
        ) {
        return res
            .status(400)
            .json({ message: "Tên nhóm và thành viên là bắt buộc" });
        }

        let conversation;

        if (type == "direct") {
            const participantId = memberIds[0];

            conversation = await Conversation.findOne({
                type: "direct",
                "participants.userId": { $all: [userId, participantId] },
            });

            if (!conversation) {
                conversation = new Conversation({
                    type: "direct",
                    participants: [{ userId }, { userId: participantId }],
                    lastMessageAt: new Date(),
                })

                await conversation.save();
            }
        }

        if (type == "group") {
            conversation = new Conversation({
                type: "group",
                participants: [{ userId }, ...memberIds.map((id) => ({ userId: id }))],
                group: {
                    name,
                    createdBy: userId,
                },
                lastMessageAt: new Date(),
            });

        await conversation.save();
        }

        if (!conversation) {
            return res.status(400).json({ message: "Conversation type không hợp lệ" });
        }

        await conversation.populate([
            {path: "participants.userId", select: "displayName avatarUrl"},
            {path: "seenBy", select: "displayName avatarUrl"},
            {path: "lastMessage.senderId", select: "displayName avatarUrl"}
        ])

        return res.status(201).json({ conversation })
    } 
    catch (error) {
        console.error("Lỗi tạo conversation:", error)
        return res.status(500).json({ message: "Lỗi server" })
    }
};

export const getConversations = async (req, res) => {
    try {
        const uesrId = req.user._id
        const conversations = await Conversation.find({
            'participants.userId': uesrId
        }).sort({lastMessageAt: -1, updateAt: -1})
          .populate({
            path: 'participants.userId',
            select: 'displayName avatarUrl'            
          })
          .populate({
            path: 'lastMessage.senderId',
            select: 'displayName avatarUrl'            
          })
          .populate({
            path: 'seenBy',
            select: 'displayName avatarUrl'            
          })

        const formatted = conversations.map((convo) => {
        const participants = (convo.participants || []).map((p) => ({
            _id: p.userId?._id,
            displayName: p.userId?.displayName,
            avatarUrl: p.userId?.avatarUrl ?? null,
            joinedAt: p.joinedAt
        }))

        return {
            ...convo.toObject(),
            unreadCounts: convo.unreadCounts || {},
            participants
        }
        })

        return res.status(200).json({conversations: formatted})
    } catch (error) {
        console.error("Lỗi get conversation:", error)
        return res.status(500).json({ message: "Lỗi server" })
    }
}

export const getMessages = async (req, res) => {}
