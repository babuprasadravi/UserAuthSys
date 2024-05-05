const User = require('../models/user'); 
const jwt = require('jsonwebtoken');
const { validationResult, check } = require('express-validator');
const nodemailer = require('nodemailer');
const { expressjwt: ejwt } = require('express-jwt')

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

// Function to handle account activation
exports.accountActivation = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({
            message: 'Token is required'
        });
    }

    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async function(err, decoded) {
        if (err) {
            console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);
            return res.status(401).json({
                error: 'Expired link. Signup again'
            });
        }

        const { name, email, phone, password } = decoded; // Use decoded object

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

// Function to handle user signin
exports.signin = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    // Destructure email and password from request body
    const { email: userEmail, password } = req.body; // Rename email to userEmail
  
    try {
      let user = await User.findOne({ email: userEmail }); // Use userEmail
      if (!user) {
        return res.status(400).json({
          error: 'User with that email does not exist. Please signup.'
        });
      }
  
      if (!user.authenticate(password)) {
        return res.status(400).json({
          error: 'Email and password do not match'
        });
      }
  
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
  };


  exports.requireSignin = ejwt({
    secret: process.env.JWT_SECRET, // makes data available in req.user (req.user._id)
    algorithms: ['HS256'],
  })

  exports.adminMiddleware = (req, res, next) => {
    // User.findById({_id: req.user._id}).exec((err, user) => {
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
