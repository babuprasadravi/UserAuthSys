const express = require('express')
const { sign } = require('jsonwebtoken')
const router = express.Router()


// Import controller
const { signup } = require('../controllers/auth');

// Import validators
const { userSignupValidator } = require('../validators/auth');
const {runValidation} = require('../validators')


// Define routes

// Route for user signup
router.post('/signup', userSignupValidator, runValidation, signup);

// Export the router
module.exports = router