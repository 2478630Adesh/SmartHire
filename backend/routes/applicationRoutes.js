const router = require('express').Router();
const {
  applyJob,
  getMyApplications,
  getJobApplicants,
  updateStatus,
  getHRStats,
} = require('../controllers/applicationController');
const { protect, hrOnly } = require('../middleware/auth');

router.use(protect);
router.post('/', applyJob);
router.get('/my', getMyApplications);
router.get('/hr/stats', hrOnly, getHRStats);
router.get('/job/:jobId', hrOnly, getJobApplicants);
router.put('/:id/status', hrOnly, updateStatus);

module.exports = router;
