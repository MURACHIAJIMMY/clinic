// const express = require('express')
// const router = express.Router()
// const {
//   saveMessage,      // for Socket integration
//   getRoomMessages
// } = require('../controllers/chatController')

// // GET /api/chat/rooms/:roomId/messages
// router.get('/rooms/:roomId/messages', getRoomMessages)

// module.exports = router

const express = require('express')
const router  = express.Router()
const auth    = require('../middleware/authMiddleware')          // your JWT/session guard
const {
  saveMessage,      // for Socket integration
  getRoomMessages,  // our updated handler
} = require('../controllers/chatController')

// Only authenticated users can fetch room messages
router.get(
  '/rooms/:roomId/messages',
  auth,
  getRoomMessages
)

module.exports = router
