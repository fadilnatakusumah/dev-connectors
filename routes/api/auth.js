/**
    Base route = /auth
*/

const { Router } = require('express');
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = Router();

const auth = require('../../middlewares/auth');
const User = require('../../models/User');

// @route GET /
// @desc Auth verify and get user
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    res.json({
      success: true,
      errors: [{ msg: "Server error" }]
    })
  }
})

// @route POST /
// @desc Authenticate and get token
// @access Public
router.post('/',
  [
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

    const { email, password } = req.body;

    try {
      // if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          errors: [{ msg: "Invalid credentials" }]
        })
      }

      const checkIsMatch = await bcrypt.compare(password, user.password);

      if (!checkIsMatch) {
        return res.status(400).json({
          success: false,
          errors: [{ msg: "Invalid credentials" }]
        })
      }

      const payload = {
        user: {
          id: user.id
        }
      }

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
