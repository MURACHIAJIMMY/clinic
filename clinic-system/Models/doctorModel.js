const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    default: 'General',
  },
  phone: String,
  gender: String,
  profileImage: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
