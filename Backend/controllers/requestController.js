import ServiceRequest from '../models/ServiceRequest.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';


const createNotification = async (
  recipientId,
  title,
  message,
  type,
  relatedRequestId = null
) => {
  try {
    await Notification.create({
      recipient: recipientId,
      title,
      message,
      type,
      relatedRequest: relatedRequestId,
      isRead: false
    });
  } catch (error) {
    console.error('Notification error:', error.message);
  }
};


const createRequest = async (req, res) => {
  try {
    const {
      category,
      title,
      description,
      priority,
      location
    } = req.body;

    const image = req.file ? req.file.filename : null;

    const request = await ServiceRequest.create({
      user: req.user._id,
      category,
      title,
      description,
      priority: priority || 'Medium',
      location,
      image
    });


    const admins = await User.find(
      { role: 'admin' },
      '_id'
    );

    for (const admin of admins) {
      await createNotification(
        admin._id,
        'New Service Request',
        `A new request "${title}" has been submitted by ${req.user.name}.`,
        'general',
        request._id
      );
    }


    const populated = await ServiceRequest.findById(request._id)
      .populate('user', 'name email department')
      .populate('category', 'name');

    res.status(201).json(populated);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const getAllRequests = async (req, res) => {
  try {
    const {
      status,
      priority,
      category
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (category) {
      filter.category = category;
    }


    const requests = await ServiceRequest.find(filter)
      .populate('user', 'name email department hostel')
      .populate('category', 'name department')
      .populate('assignedTechnician', 'name email department')
      .sort({ createdAt: -1 });

    res.json(requests);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      user: req.user._id
    })
      .populate('category', 'name department')
      .populate('assignedTechnician', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(requests);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const getAssignedRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      assignedTechnician: req.user._id
    })
      .populate('user', 'name email department hostel phone')
      .populate('category', 'name department')
      .sort({ createdAt: -1 });

    res.json(requests);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const getRequestById = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('user', 'name email department hostel phone')
      .populate('category', 'name department')
      .populate('assignedTechnician', 'name email phone department');


    if (!request) {
      return res.status(404).json({
        message: 'Request not found'
      });
    }


    if (
      req.user.role === 'user' &&
      request.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: 'Not authorized'
      });
    }


    res.json(request);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const adminUpdateRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        message: 'Request not found'
      });
    }


    const {
      status,
      assignedTechnician,
      adminNotes,
      priority
    } = req.body;

    const previousStatus = request.status;
    const previousTechnician =
      request.assignedTechnician?.toString();


    if (status) {
      request.status = status;
    }

    if (adminNotes !== undefined) {
      request.adminNotes = adminNotes;
    }

    if (priority) {
      request.priority = priority;
    }


    if (assignedTechnician !== undefined) {

      request.assignedTechnician =
        assignedTechnician || null;

      if (
        assignedTechnician &&
        request.status === 'Pending'
      ) {
        request.status = 'Assigned';
      }
    }


    if (status === 'Completed') {
      request.completedAt = new Date();
    }


    await request.save();


    if (
      status &&
      status !== previousStatus
    ) {
      await createNotification(
        request.user,
        'Request Status Updated',
        `Your request "${request.title}" status changed to ${status}.`,
        'request_update',
        request._id
      );
    }


    if (
      assignedTechnician &&
      assignedTechnician !== previousTechnician
    ) {
      await createNotification(
        assignedTechnician,
        'New Task Assigned',
        `You have been assigned a new task: "${request.title}".`,
        'assignment',
        request._id
      );
    }


    const updated = await ServiceRequest.findById(
      req.params.id
    )
      .populate('user', 'name email department')
      .populate('category', 'name department')
      .populate('assignedTechnician', 'name email');


    res.json(updated);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const userUpdateRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        message: 'Request not found'
      });
    }


    if (
      request.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: 'Not authorized'
      });
    }


    if (request.status !== 'Pending') {
      return res.status(400).json({
        message: 'Cannot edit after assignment'
      });
    }


    request.title =
      req.body.title || request.title;

    request.description =
      req.body.description || request.description;

    request.priority =
      req.body.priority || request.priority;

    request.location =
      req.body.location || request.location;


    await request.save();

    res.json(request);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const cancelRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        message: 'Request not found'
      });
    }


    if (
      request.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: 'Not authorized'
      });
    }


    if (request.status !== 'Pending') {
      return res.status(400).json({
        message: 'Cannot cancel at this stage'
      });
    }


    request.status = 'Cancelled';

    await request.save();

    res.json({
      message: 'Request cancelled',
      request
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const technicianUpdateRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        message: 'Request not found'
      });
    }


    if (
      request.assignedTechnician?.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: 'Not authorized'
      });
    }


    const {
      status,
      technicianNotes
    } = req.body;

    const repairImage =
      req.file
        ? req.file.filename
        : request.repairImage;


    if (status) {
      request.status = status;
    }

    if (technicianNotes !== undefined) {
      request.technicianNotes = technicianNotes;
    }

    request.repairImage = repairImage;


    if (status === 'Completed') {

      request.completedAt = new Date();

      await createNotification(
        request.user,
        'Service Request Completed ✓',
        `Your request "${request.title}" has been resolved.`,
        'completion',
        request._id
      );
    }


    await request.save();


    const populated = await ServiceRequest.findById(
      request._id
    )
      .populate(
        'user',
        'name email department hostel phone'
      )
      .populate(
        'category',
        'name department'
      )
      .populate(
        'assignedTechnician',
        'name email phone department'
      );


    res.json(populated);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const getDashboardStats = async (req, res) => {
  try {

    const [
      total,
      pending,
      assigned,
      inProgress,
      completed,
      rejected,
      totalUsers,
      totalTechnicians
    ] = await Promise.all([

      ServiceRequest.countDocuments(),

      ServiceRequest.countDocuments({
        status: 'Pending'
      }),

      ServiceRequest.countDocuments({
        status: 'Assigned'
      }),

      ServiceRequest.countDocuments({
        status: 'In Progress'
      }),

      ServiceRequest.countDocuments({
        status: 'Completed'
      }),

      ServiceRequest.countDocuments({
        status: 'Rejected'
      }),

      User.countDocuments({
        role: 'user'
      }),

      User.countDocuments({
        role: 'technician'
      })
    ]);


    const byCategory =
      await ServiceRequest.aggregate([

        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },

        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'category'
          }
        },

        {
          $unwind: '$category'
        },

        {
          $project: {
            name: '$category.name',
            count: 1
          }
        }

      ]);


    const currentYear =
      new Date().getFullYear();


    const monthlyData =
      await ServiceRequest.aggregate([

        {
          $match: {
            createdAt: {
              $gte: new Date(
                `${currentYear}-01-01`
              ),
              $lte: new Date(
                `${currentYear}-12-31`
              )
            }
          }
        },

        {
          $group: {
            _id: {
              $month: '$createdAt'
            },
            count: {
              $sum: 1
            }
          }
        },

        {
          $sort: {
            _id: 1
          }
        }

      ]);


    res.json({
      total,
      pending,
      assigned,
      inProgress,
      completed,
      rejected,
      totalUsers,
      totalTechnicians,
      byCategory,
      monthlyData
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


export {
  createRequest,
  getAllRequests,
  getMyRequests,
  getAssignedRequests,
  getRequestById,
  adminUpdateRequest,
  userUpdateRequest,
  cancelRequest,
  technicianUpdateRequest,
  getDashboardStats
};