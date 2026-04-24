const router = require('express').Router();
const {
  createResume,
  getMyResumes,
  getResume,
  updateResume,
  deleteResume,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').post(createResume).get(getMyResumes);
router.route('/:id').get(getResume).put(updateResume).delete(deleteResume);

module.exports = router;
