import User from "../models/User.js"
import FriendRequest from "../models/FriendRequest.js"
import Friend from "../models/Friend.js"
import { pair } from "../middlewares/friendMiddleware.js"

export const sendFriendRequest = async (req, res) => {
  try {
    const { to, message } = req.body

    const from = req.user._id

    if (from === to) {
      return res.status(400).json({ message: 'Không thể gửi lời mời kết bạn' })
    } 

    // Biến kiểm tra có _id của người dùng không
    const userExits = await User.exists({ _id: to })

    if (!userExits) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' })
    }

    let userA = from.toString()
    let userB = to.toString()

    pair(userA, userB)
    
    const [alreadyFriends, existingRequest] = await Promise.all([
      // Kiểm tra người dùng
      Friend.findOne({ userA, userB }),
      // Kiểm tra lời mời trước đó giữa userA và userB
      FriendRequest.findOne({
        $or: [
          { from, to },
          { from: to, to: from }
        ]
      })
    ])

    if (alreadyFriends) {
      return res.status(400).json({ message: 'Đã kết bạn, không thể gửi lời mời kết bạn nữa' })
    }

    if (existingRequest) {
      return res.status(400).json({ message: 'Đã có lời mời kết bạn' })
    }

    // Thành công các kiểm tra thì tạo req
    const request = await FriendRequest.create({
      from,
      to,
      message
    })

    return res.status(201).json({ message: 'Đã gửi lời mời kết bạn', request })
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi yêu cầu kết bạn' })
  }
}

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const userId = req.user._id

    const request = await FriendRequest.findById(requestId)

    if (!request) {
      return res.status(404).json({ message: 'Không tồn tại lời mời kết bạn' })
    }

    if (request.to.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' })
    }

    const newFriend = await Friend.create({
      userA: request.from,
      userB: request.to
    })

    await FriendRequest.findByIdAndDelete(requestId)

    const from = User.findById(req.from).select('_id displayName avatarUrl').lean()

    return res.status(200).json({
      message: 'Chấp nhận lời mời kết bạn thành công',
      newFriend: {
        _id: from?._id,
        displayName: from?.displayName
      }
    })
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi chấp nhận kết bạn' })
  }
}

export const declineFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const userId = req.user._id

    const request = await FriendRequest.findById(requestId)

    if (!request) {
      return res.status(404).json({ message: 'Không tồn tại lời mời kết bạn' })
    }
    
    if (request.to.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' })
    }

    await FriendRequest.findByIdAndDelete(requestId)

    return res.status(204).json({ message: 'Từ chối lời mời kết bạn thàn công' })
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi từ chối kết bạn' })
  }
}

export const getAllFriends = async (req, res) => {
  try {
    const userId = req.user._id
    const friendShips = await Friend.find({
      $or: [
        { userA: userId },
        { userB: userId }
      ]
    }).populate('userA', '_id displayName avatarUrl')
    .populate('userB', '_id displayName avatarUrl').lean()

    if (!friendShips.length) {
      return res.status(500).json({ friends: [] })
    }

    // Trong mối quan hệ (friendShips) có 2 trường, id so sánh id của user hiện tại với các id trong quan hệ để lấy id bạn bè
    const friends = friendShips.map(f => f.userA._id.toString() === userId.toString() ? f.userB : f.userA)

    return res.status(200).json({ friends })
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi tải danh sách bạn bè' })
  }
}

export const getFriendsRequest = async (req, res) => {
  try {
    const userId = req.user._id
    
    const populateFields = '_id username displayName avatarUrl'

    const [sent, received] = await Promise.all([
      FriendRequest.find({ from: userId }).populate('to', populateFields),
      FriendRequest.find({ to: userId }).populate('from', populateFields)
    ])

    return res.status(200).json({ sent, received })
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi tải danh sách yêu cầu kết bạn' })
  }
}