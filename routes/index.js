const router = require('express').Router();
const userRoutes = require('./api/userRoutes');
const thoughtRoutes = require('./api/thoughtRoutes');

// Use the user routes for all /api/users routes
router.use('/users', userRoutes);

// Use the thought routes for all /api/thoughts routes
router.use('/thoughts', thoughtRoutes);

module.exports = router;
