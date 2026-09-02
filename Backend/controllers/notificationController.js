import Notification from '../models/Notification.js';
import User from '../models/User.js';


const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false
    });

    res.json({ count });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user._id,
        isRead: false
      },
      {
        $set: { isRead: true }
      }
    );

    res.json({
      message: 'All marked as read'
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


const markOneRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user._id
      },
      {
        $set: { isRead: true }
      },
      {
        new: true
      }
    );

    if (!notification) {
      return res.status(404).json({
        message: 'Not found'
      });
    }

    res.json(notification);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


const sendAnnouncement = async (req, res) => {
  try {
    const {
      title,
      message,
      targetRole
    } = req.body;


    let filter;

    if (targetRole) {
      filter = {
        role: targetRole
      };
    } else {
      filter = {
        role: {
          $in: ['user', 'technician']
        }
      };
    }


    const recipients = await User.find(filter, '_id');


    await Notification.insertMany(
      recipients.map((user) => ({
        recipient: user._id,
        title,
        message,
        type: 'general',
        isRead: false
      }))
    );


    res.json({
      message: `Sent to ${recipients.length} users`
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


export {
  getNotifications,
  getUnreadCount,
  markAllRead,
  markOneRead,
  sendAnnouncement
};