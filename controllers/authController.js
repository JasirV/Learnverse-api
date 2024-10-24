const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
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

module.exports = { register, login, logout, logoutAll };
