const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1];
    console.log(token);

    next();
}

module.exports = authMiddleware;