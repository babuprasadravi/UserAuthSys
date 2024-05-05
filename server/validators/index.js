const { validationResult } = require('express-validator');

// Middleware function to run validation on request
exports.runValidation = (req, res, next) => {
    // Checking for validation errors using the 'validationResult' function
    const errors = validationResult(req);
    //If there are validation errors
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    // If there are no validation errors, proceed to the next middleware/controller
    next();
}
