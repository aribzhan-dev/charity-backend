const router = require('express').Router();
const {
  register,
  getEvents,
  joinEvent,
  getProfile,
  getCharities,       
  donateToCharity  
} = require('../controllers/user');

const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

const userOnly = [protect, allowRoles('user')];


router.post('/register', register);

router.get('/profile', ...userOnly, getProfile);

router.get('/charities', ...userOnly, getCharities);
router.post('/charities/:id/donate', ...userOnly, donateToCharity);

router.get('/events', ...userOnly, getEvents);
router.post('/events/:id/join', ...userOnly, joinEvent);

module.exports = router;