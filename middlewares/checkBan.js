
import User from '../models/User.js';

export const checkBanStatus = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (user.isPermanentlyBanned) {
        return res.status(403).json({ message: 'Your account has been permanently banned' });
    }
    if (user.banExpiration && new Date() < user.banExpiration) {
        return res.status(403).json({ message: 'Your account is temporarily banned', banExpiration: user.banExpiration });
    }
    next();
};
