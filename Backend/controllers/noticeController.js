import Notice from '../models/Notice.js';


const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ isActive: true })
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(notices);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const createNotice = async (req, res) => {
  try {
    const {
      title,
      content,
      priority,
      expiresAt
    } = req.body;

    const notice = await Notice.create({
      title,
      content,
      priority,
      expiresAt: expiresAt || null,
      postedBy: req.user._id
    });

    res.status(201).json(notice);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        message: 'Notice not found'
      });
    }

    notice.title = req.body.title || notice.title;
    notice.content = req.body.content || notice.content;
    notice.priority = req.body.priority || notice.priority;

    if (req.body.isActive !== undefined) {
      notice.isActive = req.body.isActive;
    }

    await notice.save();

    res.json(notice);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        message: 'Notice not found'
      });
    }

    await notice.deleteOne();

    res.json({
      message: 'Notice deleted'
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


export {
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice
};