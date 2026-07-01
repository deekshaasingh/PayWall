const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (user.isFrozen) {
            return res.status(403).json({ message: "This account has been frozen. Contact support." });
        }

        req.userId = decoded.userId;
        req.userRole = user.role;

        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired, please log in again" });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = authMiddleware;