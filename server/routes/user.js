const express = require('express')
const { sign } = require('jsonwebtoken')
const router = express.Router()

// Import controller
const { requireSignin } = require('../controllers/auth')
const { read } = require('../controllers/user')

// Define routes

//Route for reading user profile
router.get('/user/:id', requireSignin, read);

