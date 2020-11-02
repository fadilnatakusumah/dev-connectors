const { Router } = require('express');
const router = Router();

const usersRoutes = require('./users');
const authRoutes = require('./auth');
const profileRoutes = require('./profile');
const postsRoutes = require('./posts');

router.use('/users', usersRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/posts', postsRoutes);


module.exports = router;