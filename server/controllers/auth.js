const User = require('../models/user'); 
const jwt = require('jsonwebtoken');
const { validationResult, check } = require('express-validator');
const nodemailer = require('nodemailer');
const { expressjwt: ejwt } = require('express-jwt');
const FailedLoginAttempt = require('../models/loginAttempt');
const RateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');

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

        // Create JWT token for account activation
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

// Function to handle account activation
exports.accountActivation = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({
            message: 'Token is required'
        });
    }

    // Verify JWT token for account activation
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async function(err, decoded) {
        if (err) {
            console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);
            return res.status(401).json({
                error: 'Expired link. Signup again'
            });
        }

        const { name, email, phone, password } = decoded; // Use decoded object

        // Create new user from decoded data
        const user = new User({ name, email, phone, password });

        try {
            await user.save();
            return res.json({
                message: 'Signup success. Please signin.'
            });
        } catch (err) {
            console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err);
            return res.status(500).json({
                error: 'Error saving user in database. Try signup again'
            });
        }
    });
};

// Rate limit middleware to prevent brute force attacks
const loginLimiter = RateLimit({
    store: new MongoStore({ 
        uri: process.env.MONGO_URI, // Your MongoDB connection string
        expireTimeMs: 15 * 60 * 1000, // 15 minutes expiration time for blocked IPs
        errorHandler: console.error // Error handler
    }),
    windowMs: 1 * 60 * 1000, // 1 minute time frame
    max: 5, // Maximum number of requests allowed in the time frame
    handler: function(req, res) {
        return res.status(429).json({ error: "Too many login attempts from this IP, please try again after 15 minutes." });
    }});

// Function to handle user signin
exports.signin = async (req, res) => {
    // Apply rate limiting middleware
    loginLimiter(req, res, async () => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email: userEmail, password } = req.body; 

        try {
            let user = await User.findOne({ email: userEmail }); // Find user by email
            if (!user) {
                return res.status(400).json({
                    error: 'User with that email does not exist. Please signup.'
                });
            }

            if (!user.authenticate(password)) {
                // Record failed login attempt
                await FailedLoginAttempt.findOneAndUpdate({ ip: req.ip }, { $inc: { attempts: 1 }, lastAttempt: Date.now() }, { upsert: true });

                return res.status(400).json({
                    error: 'Email and password do not match'
                });
            }

            // Reset failed login attempts upon successful login
            await FailedLoginAttempt.findOneAndDelete({ ip: req.ip });

            // Generate JWT token
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            // Destructure user fields
            const { _id, name, email, phone, role } = user;

            return res.json({
                token,
                user: { _id, name, email, phone, role }
            });
        } catch (err) {
            console.error('SIGNIN ERROR', err);
            return res.status(400).json({
                error: err.message
            });
        }
    });
};

// Middleware to require signin for protected routes
exports.requireSignin = ejwt({
    secret: process.env.JWT_SECRET, // makes data available in req.user (req.user._id)
    algorithms: ['HS256'],
});

// Middleware to check if user is an admin
exports.adminMiddleware = (req, res, next) => {
    User.findById({_id: req.auth._id})
      .then(user => {
        if (!user) {
          return res.status(400).json({
            error: 'User not found',
          });
        }
  
        if (user.role !== 'admin') {
          return res.status(400).json({
            error: 'Access denied',
          });
        }
  
        req.profile = user;
        next();
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({
          error: 'Internal Server Error',
        });
      });
  };

// Function to handle forgot password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                error: 'User with that email does not exist'
            });
        }

        // Create JWT token for password reset
        const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' });  // 10 minutes

        // Update user's reset password link
        await user.updateOne({ resetPasswordLink: token });

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
            from: '', // Sender email
            to: email,
            subject: 'PASSWORD RESET LINK',
            html: `
                <h1>Please use the following link to reset your password</h1>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr />
                <p>This email may contain sensitive information</p>
                <p>${process.env.CLIENT_URL}</p>
            ` 
        };

        // Sending email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: 'Failed to send password reset email' });
            } else {
                console.log('Email sent: ' + info.response);
                return res.json({
                    message: `Password reset link has been sent to ${email}.`
                });
            }
        });
    }
    catch (err) {
        console.error('FORGOT PASSWORD ERROR', err);
        return res.status(400).json({
            error: err.message
        }); 
    }
}

// Function to handle reset password
exports.resetPassword = async (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    if (resetPasswordLink) {
        try {
            const decoded = jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD);
            const user = await User.findOne({ resetPasswordLink }).exec();

            if (!user) {
                return res.status(400).json({
                    error: 'Something went wrong. Try later'
                });
            }

            const updatedFields = {
                password: newPassword,
                resetPasswordLink: ''
            };

            Object.assign(user, updatedFields);
            await user.save();

            return res.json({
                message: `Great! Now you can login with your new password`
            });
        } catch (err) {
            return res.status(400).json({
                error: 'Expired link. Try again'
            });
        }
    }
};
