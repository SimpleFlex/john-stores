import Notification from "../models/Notification.model.js";

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20);
    const unreadCount = await Notification.countDocuments({ isRead: false });
    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
