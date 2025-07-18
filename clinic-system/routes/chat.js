const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// POST endpoint for manual room creation
router.post('/chat-room', chatController.createChatRoom);

module.exports = router;
