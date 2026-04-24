const Notification = require('../models/Notification');

// Helper — can be called from anywhere to create a notification
exports.createNotification = async ({ user, type, title, message, link = '', meta = {} }) => {
  try {
    return await Notification.create({ user, type, title, message, link, meta });
  } catch (err) {
    console.error('Failed to create notification:', err.message);
    return null;
  }
};

// @desc Get my notifications
// @route GET /api/notifications
exports.getMine = async (req, res) => {
  try {
    const notifs = await Notification.find({ user: req.user._id })
      .sort('-createdAt')
      .limit(50);
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });
    res.json({ notifications: notifs, unreadCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Mark one as read
// @route PUT /api/notifications/:id/read
exports.markRead = async (req, res) => {
  try {
    const n = await Notification.findById(req.params.id);
    if (!n) return res.status(404).json({ message: 'Not found' });
    if (n.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    n.read = true;
    await n.save();
    res.json(n);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Mark all as read
// @route PUT /api/notifications/read-all
exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete one
// @route DELETE /api/notifications/:id
exports.remove = async (req, res) => {
  try {
    const n = await Notification.findById(req.params.id);
    if (!n) return res.status(404).json({ message: 'Not found' });
    if (n.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await n.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
