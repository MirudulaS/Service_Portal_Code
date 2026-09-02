import jwt from 'jsonwebtoken';
import User from '../models/User.js';


const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.user = await User.findById(decoded.id)
        .select('-password');

      if (!req.user) {
        return res.status(401).json({
          message: 'User no longer exists.'
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          message: 'Your account has been deactivated. Contact admin.'
        });
      }

      return next();

    } catch (err) {
      return res.status(401).json({
        message: 'Session expired. Please log in again.'
      });
    }
  }

  return res.status(401).json({
    message: 'Not authorized. No token provided.'
  });
};


const admin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    return next();
  }

  return res.status(403).json({
    message: 'Admin access required.'
  });
};


const technician = (req, res, next) => {
  if (req.user?.role === 'technician') {
    return next();
  }

  return res.status(403).json({
    message: 'Technician access required.'
  });
};


export {
  protect,
  admin,
  technician
};