const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1];
    console.log(token);

    const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
    );

    console.log(decoded);

    req.userId = decoded.userId;

    next();
}

module.exports = authMiddleware;