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

// Update user profile
exports.update = (req, res, next) => {
  console.log('UPDATE USER - req.auth', req.auth, 'UPDATE DATA', req.body);
  const { name, password, phone } = req.body;

  User.findOne({ _id: req.auth._id })
    .then(user => {
      if (!user) {
        return res.status(400).json({
          error: 'User not found',
        });
      }

      if (!name) {
        return res.status(400).json({
          error: 'Name is required',
        });
      } else {
        user.name = name;
      }

      if (phone) {
        user.phone = phone;
      }

      if (password && password.length < 6) {
        return res.status(400).json({
          error: 'Password should be min 6 characters',
        });
      } else if (!password) {
        // Keep the previous password
      } else {
        user.password = password;
      }

      return user.save();
    })
    .then(updatedUser => {
      // Remove sensitive data from the response
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    })
    .catch(err => {
      console.log('USER UPDATE ERROR', err);
      return res.status(400).json({
        error: 'User update failed',
      });
    });
};

