// Import required modules
const express = require('express');
const { sign } = require('jsonwebtoken');

// Create router instance
const router = express.Router();

// Import controllers
const { signup, accountActivation, signin, forgotPassword, resetPassword } = require('../controllers/auth');

// Import validators
const { userSignupValidator, userSigninValidator, forgotPasswordValidator, resetPasswordValidator, passwordValidator } = require('../validators/auth');
const { runValidation } = require('../validators');

// Define routes

// Route for user signup
router.post('/signup', userSignupValidator, runValidation, signup);

// Route for account activation
router.post('/account-activation', accountActivation);

// Route for user signin
router.post('/signin', userSigninValidator, runValidation, signin);

// Route for forgot password
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword);

// Route for reset password
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);

// Export the router
module.exports = router;
