/**
    Base route = /profile
*/

const { Router } = require('express');
const auth = require('../../middlewares/auth');
const { check, validationResult } = require('express-validator')
const config = require('config');
const request = require('request');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

const router = Router();

// @route GET /
// @desc get all profiles
// @access Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find()
      .populate('user', ['name', 'avatar'])
      .sort('-date');
    // .limit(10)
    // if (!profile) {
    //   return res.status(400).json({
    //     success: false,
    //     errors: [{ msg: "No profile found" }]
    //   })
    // }

    res.json({
      success: true,
      data: profiles,
    })
  } catch (error) {
    console.error("error", error)
    res.status(500).json({
      success: false,
      errors: [{ msg: "Server error" }]
    })
  }
})


// @route GET /
// @desc get profile by id
// @access Public
router.get('/user/:user_id', async (req, res) => {
  console.log("req.params", req.params)
  try {
    const profile = await Profile.findOne({ user: req.params.user_id })
      .populate('user', ['name', 'avatar'])
    if (!profile) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "No profile found" }]
      })
    }

    res.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    console.error("error", error)
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "No profile found" }]
      })
    }
    res.status(500).json({
      success: false,
      errors: [{ msg: "Server error" }]
    })
  }
})

// @route GET /me
// @desc get current user profile
// @access Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile
      .findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "No profile found" }]
      })
    }

    res.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    console.error("error", error)
    res.status(500).json({
      success: false,
      errors: [{ msg: "Server error" }]
    })
  }
})


// @route POST /
// @desc create or update profile
// @access Private
router.post('/',
  [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
  ]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // build social profile fields
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      // update
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );


        return res.json({
          success: true,
          data: profile
        })
      }

      // create
      profile = new Profile(profileFields);
      await profile.save();
      res.json({
        success: true,
        data: profile,
      })
    } catch (error) {
      console.error("error", error)
      res.status(500).json({
        success: false,
        errors: [{ msg: "Server error" }]
      })
    }
  });


// @route DELETE /
// @desc delete profile, user and posts
// @access Private
router.delete('/', auth, async (req, res) => {
  try {
    // TODO: remove users posts
    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({
      success: true,
      data: [{ msg: "User deleted" }]
    })
  } catch (error) {
    console.error("error", error)
    res.status(500).json({
      success: false,
      errors: [{ msg: "Server error" }]
    })
  }
})

// @route PUT /
// @desc add profile experience
// @access Private
router.put('/experience', [
  auth,
  check('title', 'Title is required').notEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description,
  } = req.body;

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description,
  }

  try {
    // update profile
    const profile = await Profile.findOne({ user: req.user.id },);

    profile.experience.unshift(newExp);
    await profile.save();
    res.json({
      success: true,
      data: profile
    })
  } catch (error) {
    console.error("error", error)
    res.status(500).json({
      success: false,
      errors: [{ msg: "Server error" }]
    })
  }
});

// @route DELETE /
// @desc delete profile experience
// @access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {

  try {
    // delete profile
    const profile = await Profile.findOne({ user: req.user.id });
    
    console.log("req.params.exp_id", req.params.exp_id)
    const newExperiences = profile.experience
      ? profile.experience.filter(({ id }) => id !== req.params.exp_id)
      : []
    profile.experience = [...newExperiences];

    await profile.save();
    res.json({
      success: true,
      data: profile
    })
  } catch (error) {
    console.error("error", error)
    res.status(500).json({
      success: false,
      errors: [{ msg: "Server error" }]
    })
  }
});

// @route PUT /
// @desc add profile education
// @access Private
router.put('/education', [
  auth,
  check('school', 'School is required').notEmpty(),
  check('degree', 'Degree is required').not().isEmpty(),
  check('fieldofstudy', 'Field of Study is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  } = req.body;

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  }

  try {
    // update profile
    const profile = await Profile.findOne({ user: req.user.id },);

    profile.education.unshift(newEdu);
    await profile.save();
    res.json({
      success: true,
      data: profile
    })
  } catch (error) {
    console.error("error", error)
    res.status(500).json({
      success: false,
      errors: [{ msg: "Server error" }]
    })
  }
});

// @route DELETE /
// @desc delete profile education
// @access Private
router.delete('/education/:edu_id', auth, async (req, res) => {

  try {
    // delete profile
    const profile = await Profile.findOne({ user: req.user.id },);

    const newEducations = profile.experience
      ? profile.education.filter(({ id }) => id !== req.params.edu_id)
      : []
    profile.education = newEducations;

    await profile.save();
    res.json({
      success: true,
      data: profile
    })
  } catch (error) {
    console.error("error", error)
    res.status(500).json({
      success: false,
      errors: [{ msg: "Server error" }]
    })
  }
});

// @route GET /github/:username
// @desc get user repos
// @access Public
router.get('/github/:username', async (req, res) => {
  try {
    const configs = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: {
        'user-agent': 'node.js'
      }
    };

    request(configs, (error, response, body) => {
      if (error) console.error("error", error);
      if (response.statusCode !== 200) {
        return res.status(404).json({
          data: [{ msg: `No Github's profile found` }]
        })
      }

      res.json({
        success: true,
        data: JSON.parse(body)
      })
    })
  } catch (error) {
    console.error("error", error)
    res.status(500).json({
      success: false,
      errors: [{ msg: "Server error" }]
    })
  }
});


module.exports = router;
