// // controllers/chatController.js

// const ChatMessage = require('../Models/chatModel');

// exports.saveMessage = async (messageData) => {
//   try {
//     const message = new ChatMessage(messageData);
//     await message.save();
//     return message;
//   } catch (err) {
//     console.error('Error saving message:', err);
//     throw err;
//   }
// };

// Create a chat room manually — used for Postman testing
exports.createChatRoom = async (req, res) => {
  const { doctorId, patientId } = req.body;

  if (!doctorId || !patientId) {
    return res.status(400).json({ error: 'doctorId and patientId are required' });
  }

  const roomId = `doctor_${doctorId}_patient_${patientId}`;

  try {
    // Optional: You could store this in DB if tracking rooms
    console.log('✅ Manually creating room:', roomId);
    res.status(201).json({ success: true, roomId });
  } catch (error) {
    console.error('❌ Error creating room:', error.message);
    res.status(500).json({ error: 'Room creation failed' });
  }
};
