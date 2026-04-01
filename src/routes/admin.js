const router = require('express').Router();
const {
  createCompany,
  getCompanies,
  getUsers,
  getRequests,
  acceptRequest,
  rejectRequest
} = require('../controllers/admin');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

const adminOnly = [protect, allowRoles('admin')];


router.post('/company', ...adminOnly, createCompany);
router.get('/companies', ...adminOnly, getCompanies);

router.get('/users', ...adminOnly, getUsers);

router.get('/requests', ...adminOnly, getRequests);
router.patch('/requests/:requestType/:id/accept', ...adminOnly, acceptRequest);
router.patch('/requests/:requestType/:id/reject', ...adminOnly, rejectRequest);

module.exports = router;