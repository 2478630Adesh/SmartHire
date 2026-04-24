const router = require('express').Router();
const {
  createJob,
  getJobs,
  getJob,
  getMyJobs,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect, hrOnly } = require('../middleware/auth');

router.get('/', getJobs);
router.get('/my/posts', protect, hrOnly, getMyJobs);
router.post('/', protect, hrOnly, createJob);
router.get('/:id', getJob);
router.put('/:id', protect, hrOnly, updateJob);
router.delete('/:id', protect, hrOnly, deleteJob);

module.exports = router;
