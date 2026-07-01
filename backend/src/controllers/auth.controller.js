const User = require('../models/user.model');
const signupSchema = require('../validators/auth.validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const result = signupSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ message: "Invalid input", errors: result.error.issues });
        }

        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(409).json({ message: "Email is already registered!" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        const user = new User(req.body);
        await user.save();

        res.status(201).json({ message: "Signup successful" });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

const login = async (req, res) => {
    try {
        const loggedUser = await User.findOne({ email: req.body.email });

        if (!loggedUser) {
            return res.status(404).json({ message: "User does not exist!" });
        }

        if (loggedUser.isFrozen) {
            return res.status(403).json({ message: "This account has been frozen. Contact support." });
        }

        const isMatch = await bcrypt.compare(req.body.password, loggedUser.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = jwt.sign(
            { userId: loggedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "User logged in successfully!",
            token: token
        });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = { login, signup };