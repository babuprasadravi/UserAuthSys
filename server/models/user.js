const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const PhoneNumber = require('libphonenumber-js');

// Define the schema for the user collection
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        // Validate phone number using libphonenumber-js
        validate: {
            validator: function(value) {
                return PhoneNumber.isValidNumber(value);
            },
            message: 'Invalid phone number'
        }
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'subscriber'
    },
    resetPasswordLink: {
        type: String,
        default: ''
    }
}, 
// Add timestamps for createdAt and updatedAt
{ timestamps: true });

// Middleware: Hash the password before saving it to the database
userSchema.pre('save', function(next) {
    // If password is not modified, move to the next middleware
    if (!this.isModified('password')) {
        return next();
    }

    // Generate salt and hash the password
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            // Set hashed password
            this.password = hash;
            next();
        });
    });
});

// Method to authenticate user by comparing hashed password
userSchema.methods.authenticate = function(plainText) {
    return bcrypt.compareSync(plainText, this.password);
};

// Create and export the User model
module.exports = mongoose.model('User', userSchema);
