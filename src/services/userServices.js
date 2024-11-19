const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const getSignedToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

const matchPassword = async (enteredPassword, userPassword) => {
    return await bcrypt.compare(enteredPassword, userPassword);
};

module.exports = {
    getSignedToken,
    matchPassword,
};
