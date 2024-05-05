const User = require('../models/user');

// Read user profile
exports.read = (req, res) => {
  console.log('REQ USER', req);
  const userId = req.params.id;
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(400).json({
          error: 'User not found',
        });
      }
      // Remove sensitive data from the response
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    })
    .catch(err => {
      return res.status(400).json({
        error: 'User not found',
      });
    });
};
