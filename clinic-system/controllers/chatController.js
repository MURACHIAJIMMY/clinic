const ChatMessage = require('../Models/chatModel')

/** Save a message from Socket.IO */
exports.saveMessage = async ({ roomId, senderId, message, createdAt }) => {
  return ChatMessage.create({
    roomId,
    sender:     senderId,
    message,
    timestamp:  createdAt,
    status:     'sent'
  })
}

/** Fetch all messages in one room */
exports.getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params
    const msgs = await ChatMessage.find({ roomId })
      .sort('timestamp')
      .lean()

    const formatted = msgs.map(m => ({
      roomId:    m.roomId,
      senderId:  m.sender.toString(),
      message:   m.message,
      createdAt: m.timestamp.toISOString()
    }))

    res.status(200).json(formatted)
  } catch (err) {
    console.error('Error fetching room messages:', err)
    res.status(500).json({ error: 'Failed to load messages' })
  }
}
