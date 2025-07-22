// helpers/email.js (or wherever you keep it)
const nodemailer = require('nodemailer')

const sendResetEmailHelper = async (email, resetToken) => {
  try {
    // create transporter as before
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    // pick the base URL from env (deployed or local)
    const BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000'

    // build the reset link dynamically
    const resetUrl = `${BASE_URL}/reset/${resetToken}`

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Click the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.`
    }

    await transporter.sendMail(mailOptions)
    console.log(`Password reset email sent to ${email}`)
  } catch (error) {
    console.error('Error sending reset email:', error)
  }
}

module.exports = { sendResetEmailHelper }
