const express = require('express')
const { sign } = require('jsonwebtoken')
const router = express.Router()


// Import controller
const { signup, accountActivation } = require('../controllers/auth');

// Import validators
const { userSignupValidator, userSigninValidator } = require('../validators/auth');
const {runValidation} = require('../validators')


// Define routes

// Route for user signup
router.post('/signup', userSignupValidator, runValidation, signup);

// Route for account activation
router.post('/account-activation', accountActivation);

// Export the router
module.exports = router