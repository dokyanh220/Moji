import express from 'express'
import {
  acceptFriendRequest,
  declineFriendRequest,
  getAllFriends,
  getFriendsRequest,
  sendFriendRequest
} from '../controllers/friendController.js'

const router = express.Router()

router.get('/', getAllFriends)
router.get('/requests', getFriendsRequest)

router.post('/requests', sendFriendRequest)
router.post('/requests/:requestId/accept', acceptFriendRequest)
router.post('/requests/:requestId/decline', declineFriendRequest)

export default router