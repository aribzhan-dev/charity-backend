const router = require('express').Router();
const {
  login,
  createEventRequest,
  createCharityRequest,
  getMyRequests
} = require('../controllers/company');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const upload = require('../utils/upload');

const companyOnly = [protect, allowRoles('company')];


router.post('/login', login);

router.post('/requests/event', ...companyOnly, upload.array('files', 10), createEventRequest);
router.post('/requests/charity', ...companyOnly, upload.array('files', 10), createCharityRequest);
router.get('/requests/my', ...companyOnly, getMyRequests);

module.exports = router;