const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// Bring in User model
const User = require('../../models/User');

// @route  GET api/auth
// @desc   Test Route
// @access Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      '-password'
    );
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  GET api/auth
// @desc   Authenticate user and get token
// @access Public
router.post(
  '/',
  [
    check('email', 'Please include an email').isEmail(),
    check(
      'password',
      'Password is required'
    ).exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // console.log(validationResult(req));
    // console.log(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      

      // Check if password matches using compare from bcrypt
      const isMatch = await bcrypt.compare(password, user.password)
      if(!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Return JWToken
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 3600000000 }, (err, token) => {
        if (err) {
          throw err;
        }
        res.json({ token })
      });


    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
