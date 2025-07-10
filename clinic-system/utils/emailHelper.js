const nodemailer = require('nodemailer');

const sendResetEmailHelper = async (email, resetToken) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use Gmail or another provider
            auth: {
                user: process.env.EMAIL_USER, // Store credentials in `.env`
                pass: process.env.EMAIL_PASS
            }
        });

        const resetUrl = `http://localhost:5000/reset/${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `Click the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.`
        };

        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${email}`);
    } catch (error) {
        console.error('Error sending reset email:', error);
    }
};

module.exports = { sendResetEmailHelper };
