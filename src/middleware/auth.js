const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findOne({ _id: decoded.id });
        next();
    } catch (error) {
        console.log("error", error)
        res.status(401).json({
            success: false,
            error: 'Not authorized'
        });
    }
};

module.exports = { protect };