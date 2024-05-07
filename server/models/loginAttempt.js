// loginAttempts.js

const mongoose = require('mongoose');

// Create a schema for failed login attempts
const FailedLoginAttemptSchema = new mongoose.Schema({
    ip: String,
    attempts: { type: Number, default: 0 },
    lastAttempt: { type: Date, default: Date.now }
});

// Create a model for failed login attempts
const FailedLoginAttempt = mongoose.model('FailedLoginAttempt', FailedLoginAttemptSchema);

module.exports = FailedLoginAttempt;
