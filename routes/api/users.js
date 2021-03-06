/**
    Base route = /users
*/

const { Router } = require('express');
const { check, validationResult } = require('express-validator')
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

const router = Router();

// @route POST /
// @desc Register user
// @access Public
router.post('/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        success: false
      })
    }

    const { name, email, password } = req.body;

    try {
      // if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          success: false,
          errors: [{ msg: "User already exists" }]
        })
      }
      // get user gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      user = new User({
        name, email, password, avatar
      })
      // encrypt password with bcrypt
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      }

      // return jsonwebtoken
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          return res.json({ success: true, data: token })
        }
      );
    } catch (error) {
      console.error("error", error)
      res.status(500).json({
        success: false,
        errors: [{ msg: "Server error" }]
      })
    }

  });

module.exports = router;