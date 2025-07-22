


const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');

// 🔐 Middleware to authenticate users via JWT
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('🪪 Incoming token:', token);

      // ✅ Decode JWT payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('🔓 Decoded token:', decoded);

      // ✅ Fetch user by decoded ID and strip password
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found in database' });
      }

      // ✅ Attach full user object to request
      req.user = user;
      next();
    } catch (error) {
      console.error('❌ Token validation failed:', error.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } else {
    return res.status(401).json({ message: 'Authorization token missing' });
  }
};

// 🛡 Middleware to restrict access to doctors only
const doctorAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (req.user.role !== 'doctor') {
    return res.status(403).json({ message: 'Access denied: doctor role required' });
  }

  next();
};

module.exports = { protect, doctorAccess };
