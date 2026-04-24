const router = require('express').Router();
const {
  analyzeBuiltResume,
  analyzeUploadedResume,
  checkUploadedResume,
} = require('../controllers/atsController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);
router.post('/analyze-resume', analyzeBuiltResume);
router.post('/analyze-upload', upload.single('resume'), analyzeUploadedResume);
router.post('/check-upload', upload.single('resume'), checkUploadedResume);

module.exports = router;
