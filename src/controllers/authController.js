const User = require('../models/User');
const { getSignedToken, matchPassword } = require('../services/userServices'); 

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password',
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }

        const isMatch = await matchPassword(password, user.password); 

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }

        const token = getSignedToken(user);


        res.status(200).json({
            success: true,
            token,
            user: req.user,
        });

    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({
            success: false,
            error: 'Server error, please try again later',
        });
        next(error); 
    }
};
