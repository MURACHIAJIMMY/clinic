

const ChatMessage = require('../Models/chatModel')

/** Fetch all messages in one room, with auth & authorization */
exports.getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params
    const userId     = req.user.id || req.user._id

    // 1) Parse roomId: "doctor_<doctorId>_patient_<patientId>"
    const parts = roomId.split('_')
    if (
      parts.length !== 4 ||
      parts[0] !== 'doctor' ||
      parts[2] !== 'patient'
    ) {
      return res.status(400).json({ error: 'Invalid roomId format' })
    }

    const [ , doctorId, , patientId ] = parts

    // 2) Authorize: only the doctor or the patient may view
    if (userId !== doctorId && userId !== patientId) {
      return res.status(403).json({ error: 'Access denied' })
    }

    // 3) Fetch & sort messages
    const msgs = await ChatMessage.find({ roomId })
      .sort('timestamp')
      .lean()

    // 4) Format payload
    const formatted = msgs.map(m => ({
      roomId:    m.roomId,
      senderId:  m.sender.toString(),
      message:   m.message,
      createdAt: m.timestamp.toISOString(),
    }))

    return res.status(200).json(formatted)
  } catch (err) {
    console.error('Error fetching room messages:', err)
    return res.status(500).json({ error: 'Failed to load messages' })
  }
}
