// middlewares/adminMiddleware.js
import User from '../models/User.js';

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.userType !== 'Admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error checking admin status' });
  }
};

export default isAdmin;