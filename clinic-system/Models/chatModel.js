const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
  roomId:  { type: String, required: true },
  sender:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  timestamp:{ type: Date, default: Date.now },
  status:  { type: String, enum: ['sent','delivered','read'], default: 'sent' }
})

module.exports = mongoose.model('ChatMessage', chatSchema)
