const router = require('express').Router();
const { getMine, markRead, markAllRead, remove } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getMine);
router.put('/read-all', markAllRead);
router.put('/:id/read', markRead);
router.delete('/:id', remove);

module.exports = router;
