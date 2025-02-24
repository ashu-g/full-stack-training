const jwt = require('jwt-simple')
const User = require('../models/user');

async function userRegistration(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (error) {
        res.status(500).json({ error: `Registration failed ${error}` });
    }
}

async function userLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.encode({ userId: user._id, email: user.email }, process.env.SECRET_KEY);

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: `Login failed ${error}` });
    }
}

module.exports = {
    userRegistration,
    userLogin
};