const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const verifyOtp=require('../utils/verifyOtp')
const { sendErrorResponse } = require('../utils/responseHelper');
const axios = require('axios');
const sendOtp  = require('../utils/sentOtp');
const verifyOtp  = require('../utils/verifyOtp');

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            if (existingUser.isVarified) {
                return res.status(400).json({ message: 'User already exists' });
            } else {
                // Resend OTP to the existing user
                const otp = await sendOtp(email);
                existingUser.otp = otp;
                existingUser.otpExpires = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
                await existingUser.save();
                return res.status(200).json({ message: 'OTP resent', otp: existingUser.otp });
            }
        }

        // Create new user and send OTP
        const otp = await sendOtp(email);
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword, otp, otpExpires: Date.now() + 15 * 60 * 1000 });
        await user.save();

        res.status(201).json({ message: 'User registered successfully. Check your email for the OTP.', otp });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};
const verifyUserOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if OTP is valid and not expired
        if (user.otp === otp && Date.now() < user.otpExpires) {
            user.isVerified = true;
            user.otp = undefined; // Clear OTP
            user.otpExpires = undefined; // Clear expiration
            await user.save();
            res.status(200).json({ message: 'OTP verified successfully' });
        } else {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.tokens.push({ token, deviceInfo: req.headers['user-agent'] });
        if (user.tokens.length > 3) {
            user.tokens.shift(); 
        }
        await user.save();

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const logout = async (req, res) => {
    
    try {
        const { token } = req.body;  
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.tokens = user.tokens.filter((t) => t.token !== token);
        await user.save();

        res.status(200).json({ message: 'Logged out of single device' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const logoutAll = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.tokens = [];
        await user.save();

        res.status(200).json({ message: 'Logged out of all devices' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const gitHubAuth = async (req, res) => {
    try {
        const { code } = req.query;
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            { headers: { Accept: 'application/json' } }
        );

        const { access_token } = tokenResponse.data;

        if (!access_token) {
            throw new Error('Access token not retrieved from GitHub');
        }

        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const { email, login } = userResponse.data;

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ username: login, email, password: null });
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.tokens.push({ token, deviceInfo: req.headers['user-agent'] });
        if (user.tokens.length > 3) {
            user.tokens.shift();
        }
        await user.save();

        res.status(200).json({ message: 'GitHub login successful', token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        sendErrorResponse(res, 'Error during GitHub authentication');
    }
};
const googleAuth = async (req, res) => {
    const { credential } = req.body;

    try {
        const decoded = jwt.decode(credential);
        const { email, name, picture } = decoded; 
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                username: name,
                email,
                password: null, 
                avatar: picture 
            });
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        user.tokens.push({ token, deviceInfo: req.headers['user-agent'] });
        if (user.tokens.length > 3) {
            user.tokens.shift(); 
        }
        await user.save();
        res.status(200).json({
            message: 'Google login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar 
            }
        });
    } catch (error) {
        sendErrorResponse(res, error.message);
    }
};
module.exports = { register, login, logout, logoutAll,gitHubAuth,googleAuth,verifyUserOtp};
