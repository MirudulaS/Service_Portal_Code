import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";


const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "30d"
    }
  );
};


const registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      department,
      hostel,
      phone
    } = req.body;


    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists with this email"
      });
    }


    const user = await User.create({
      name,
      email,
      password,
      department,
      hostel,
      phone,
      role: "user"
    });


    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      token: generateToken(user._id)
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


const loginUser = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;


    const user = await User
      .findOne({ email })
      .select("+password");


    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }


    if (!user.isActive) {
      return res.status(403).json({
        message: "Your account has been deactivated. Contact admin."
      });
    }


    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }


    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      hostel: user.hostel,
      phone: user.phone,
      token: generateToken(user._id)
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


const getMe = async (req, res) => {
  res.json(req.user);
};


const updateProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }


    user.name = req.body.name || user.name;
    user.department = req.body.department || user.department;
    user.hostel = req.body.hostel || user.hostel;
    user.phone = req.body.phone || user.phone;


    if (req.body.password) {
      user.password = req.body.password;
    }


    const updated = await user.save();


    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      department: updated.department,
      hostel: updated.hostel,
      phone: updated.phone,
      token: generateToken(updated._id)
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


const forgotPassword = async (req, res) => {

  try {

    const user = await User.findOne({
      email: req.body.email
    });


    if (!user) {
      return res.status(404).json({
        message: "No account found with that email"
      });
    }


    const resetToken = crypto
      .randomBytes(20)
      .toString("hex");


    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");


    user.resetPasswordToken = hashedToken;

    user.resetPasswordExpire =
      Date.now() + 10 * 60 * 1000;


    await user.save({
      validateBeforeSave: false
    });


    res.json({
      message: "Password reset token generated",
      resetToken
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


const resetPassword = async (req, res) => {

  try {

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");


    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: {
        $gt: Date.now()
      }
    });


    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token"
      });
    }


    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;


    await user.save();


    res.json({
      message: "Password reset successful. Please login."
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


export {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword
};