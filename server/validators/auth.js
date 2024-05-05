const { check } = require('express-validator');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

// Validation middleware for user sign-up
exports.userSignupValidator = [
    // Check if the name field is not empty
    check('name')
        .not()  
        .isEmpty()
        .withMessage('Name is required'),

    // Check if the email field is a valid email address
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),

    // Custom validation for the phone field using libphonenumber-js library
    check('phone') 
        .custom(value => {
            const phoneNumber = parsePhoneNumberFromString(value, 'International');
            if (!phoneNumber || !phoneNumber.isValid()) {
                throw new Error('Must be a valid phone number');
            }
            return true;
        }),

    // Check if the password field is at least 6 characters long
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

// Validation middleware for user sign-in
exports.userSigninValidator = [
    // Check if the email field is a valid email address
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),

    // Check if the password field is at least 6 characters long
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

// Validation middleware for forgot password
exports.forgotPasswordValidator = [
    // Check if the email field is a valid email address
    check('email')
        .not()
        .isEmpty()
        .isEmail()
        .withMessage('Must be a valid email address')
];
