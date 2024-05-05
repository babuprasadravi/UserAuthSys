const User = require('../models/user'); 
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Function to handle user signup
exports.signup = async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                error: "Email is taken",
            });
        }

        const token = jwt.sign(
            { name, email, phone, password },
            process.env.JWT_ACCOUNT_ACTIVATION,
            { expiresIn: "10m" }
        );

        // Nodemailer transporter setup
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Email data
        const mailOptions = {
            from: 'userauthsys@gmail.com',
            to: email,
            subject: 'ACCOUNT ACTIVATION LINK',
            html: `
                <h1>Please use the following link to activate your account</h1>
                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                <hr />
                <p>This email may contain sensitive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `
        };

        // Sending email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: 'Failed to send activation email' });
            } else {
                console.log('Email sent: ' + info.response);
                return res.json({
                    message: `Activation link has been sent to ${email}. Please activate your account.`
                });
            }
        });
    } catch (err) {
        console.error('SIGNUP ERROR', err);
        return res.status(400).json({
            error: err.message
        });
    }
};