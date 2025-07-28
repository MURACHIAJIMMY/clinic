

const express = require('express')
const router  = express.Router()

// Grab the function directly
const { protect } = require('../middleware/authMiddleware')

const {
  saveMessage,
  getRoomMessages,
} = require('../controllers/chatController')

// Sanity check
console.log('🚦 protect is a', typeof protect) // should log "function"
console.log('🚦 getRoomMessages is a', typeof getRoomMessages) // should log "function"

router.get(
  '/rooms/:roomId/messages',
  protect,
  getRoomMessages
)

module.exports = router
