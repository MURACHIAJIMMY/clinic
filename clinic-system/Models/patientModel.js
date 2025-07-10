const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: String,
  email: String,
  phone: String, // optional
  age: Number,   // optional
  gender: String, // optional
  profileImage: String, // optional
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
