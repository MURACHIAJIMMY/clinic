const express = require('express')
const router = express.Router()
const {
  saveMessage,      // for Socket integration
  getRoomMessages
} = require('../controllers/chatController')

// GET /api/chat/rooms/:roomId/messages
router.get('/rooms/:roomId/messages', getRoomMessages)

module.exports = router
