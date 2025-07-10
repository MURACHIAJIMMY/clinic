

// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto');
// const User = require('../Models/userModel');
// const Patient = require('../Models/patientModel');
// const { sendResetEmailHelper } = require('../utils/emailHelper');

// // 🔐 Generate JWT Token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '360d' });
// };

// // ✅ Register New User
// const registerUser = async (req, res) => {
//   const { name, email, password, role, age, gender, phone } = req.body;
//   console.log('📩 Registration request received:', req.body);

//   if (!name || !email || !password || !role) {
//     console.log('⛔ Missing fields');
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   try {
//     const userExists = await User.findOne({ email: email.toLowerCase().trim() });
//     if (userExists) {
//       console.log('⚠️ Email already registered');
//       return res.status(400).json({ message: 'Email already in use' });
//     }

//     const user = await User.create({
//       name,
//       email: email.toLowerCase().trim(),
//       password,
//       role,
//     });

//     console.log('✅ User registered:', user.email);

//     // ➕ Sync patient details if role is 'patient'
//     if (user.role === 'patient') {
//       try {
//         await Patient.create({
//           userId: user._id,
//           name: user.name,
//           email: user.email,
//           age: age || null,
//           gender: gender || null,
//           phone: phone || null,
//         });
//         console.log('🩺 Patient profile created with extended info');
//       } catch (err) {
//         console.error('⚠️ Failed to create patient profile:', err.message);
//       }
//     }

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     });
//   } catch (error) {
//     console.error('🚨 Registration error:', error.message);
//     res.status(500).json({ message: 'Server error during registration' });
//   }
// };

// // ✅ Login User
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   console.log('📨 Login attempt:', email);

//   try {
//     const user = await User.findOne({ email: email.toLowerCase().trim() });
//     console.log('🔍 User lookup:', user ? '✅ Found' : '❌ Not found');
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const isMatch = await user.matchPassword(password);
//     console.log('Password match result:', isMatch);

//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     res.status(200).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     console.error('🔥 Login error:', error.message);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// };

// // 🔄 Send Password Reset Email
// const sendResetEmail = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email: email.toLowerCase().trim() });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const resetToken = crypto.randomBytes(32).toString('hex');
//     user.resetToken = resetToken;
//     user.resetTokenExpiry = Date.now() + 3600000;
//     await user.save();

//     await sendResetEmailHelper(user.email, resetToken);
//     res.status(200).json({ message: 'Password reset email sent!' });
//   } catch (error) {
//     console.error('❗ Error sending reset email:', error.message);
//     res.status(500).json({ message: 'Server error sending reset email' });
//   }
// };

// // 🔁 Reset Password
// const resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { newPassword } = req.body;

//   try {
//     const user = await User.findOne({
//       resetToken: token,
//       resetTokenExpiry: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid or expired reset token' });
//     }

//     user.password = await bcrypt.hash(newPassword, 10);
//     user.resetToken = null;
//     user.resetTokenExpiry = null;
//     await user.save();

//     res.status(200).json({ message: 'Password reset successful' });
//   } catch (error) {
//     console.error('❗ Reset password error:', error.message);
//     res.status(500).json({ message: 'Server error resetting password' });
//   }
// };

// module.exports = {
//   registerUser,
//   loginUser,
//   sendResetEmail,
//   resetPassword,
//   generateToken,
// };

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../Models/userModel');
const Patient = require('../Models/patientModel');
const Doctor = require('../Models/doctorModel'); // ✅ Added for doctor sync
const { sendResetEmailHelper } = require('../utils/emailHelper');

// 🔐 Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '360d' });
};

// ✅ Register New User
const registerUser = async (req, res) => {
  const { name, email, password, role, age, gender, phone, specialization } = req.body;
  console.log('📩 Registration request received:', req.body);

  if (!name || !email || !password || !role) {
    console.log('⛔ Missing fields');
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      console.log('⚠️ Email already registered');
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      role,
    });

    console.log('✅ User registered:', user.email);

    // 🩺 Create patient profile if role = 'patient'
    if (user.role === 'patient') {
      try {
        await Patient.create({
          userId: user._id,
          name: user.name,
          email: user.email,
          age: age || null,
          gender: gender || null,
          phone: phone || null,
        });
        console.log('🩺 Patient profile created with extended info');
      } catch (err) {
        console.error('⚠️ Failed to create patient profile:', err.message);
      }
    }

    // 🩻 Create doctor profile if role = 'doctor'
    if (user.role === 'doctor') {
      try {
        await Doctor.create({
          userId: user._id,
          name: user.name,
          specialization: specialization || 'General',
          gender: gender || null,
          phone: phone || null,
        });
        console.log('🩻 Doctor profile created with extended info');
      } catch (err) {
        console.error('⚠️ Failed to create doctor profile:', err.message);
      }
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('🚨 Registration error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// ✅ Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('📨 Login attempt:', email);

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    console.log('🔍 User lookup:', user ? '✅ Found' : '❌ Not found');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    console.log('🔐 Password match result:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('🔥 Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// 🔄 Send Password Reset Email
const sendResetEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    await sendResetEmailHelper(user.email, resetToken);
    res.status(200).json({ message: 'Password reset email sent!' });
  } catch (error) {
    console.error('❗ Error sending reset email:', error.message);
    res.status(500).json({ message: 'Server error sending reset email' });
  }
};

// 🔁 Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('❗ Reset password error:', error.message);
    res.status(500).json({ message: 'Server error resetting password' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  sendResetEmail,
  resetPassword,
  generateToken,
};
