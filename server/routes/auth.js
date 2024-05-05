const express = require('express')
const { sign } = require('jsonwebtoken')
const router = express.Router()


// Import controller
const { signup, accountActivation, signin, forgotPassword } = require('../controllers/auth');

// Import validators
const { userSignupValidator, userSigninValidator, forgotPasswordValidator } = require('../validators/auth');
const {runValidation} = require('../validators')


// Define routes

// Route for user signup
router.post('/signup', userSignupValidator, runValidation, signup);

// Route for account activation
router.post('/account-activation', accountActivation);

// Route for user signin
router.post('/signin', userSigninValidator, runValidation, signin);

//Route for Forgot password
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword);


// Export the router
module.exports = router