const express = require('express')
const { sign } = require('jsonwebtoken')
const router = express.Router()

// Import controller
const { requireSignin, adminMiddleware } = require('../controllers/auth')
const { read,update } = require('../controllers/user')

// Routes

// Route for reading user profile
router.get('/user/:id', requireSignin, read);

// Route for updating user profile
router.put('/user/update', requireSignin, update);

// Route for updating admin profile
router.put('/admin/update', requireSignin, adminMiddleware,  update);

module.exports = router
