import User from '../models/User.js';


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $ne: 'admin' }
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      department,
      hostel,
      phone
    } = req.body;


    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }


    const user = await User.create({
      name,
      email,
      password,
      role,
      department,
      hostel,
      phone
    });


    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      isActive: user.isActive
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }


    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;


    if (req.body.department !== undefined) {
      user.department = req.body.department;
    }

    if (req.body.hostel !== undefined) {
      user.hostel = req.body.hostel;
    }

    if (req.body.phone !== undefined) {
      user.phone = req.body.phone;
    }

    if (req.body.isActive !== undefined) {
      user.isActive = req.body.isActive;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }


    const updatedUser = await user.save();


    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      department: updatedUser.department,
      isActive: updatedUser.isActive
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    await user.deleteOne();

    res.json({
      message: 'User removed successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const getTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({
      role: 'technician'
    }).select('-password');

    res.json(technicians);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


export {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getTechnicians
};