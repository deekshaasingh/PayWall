const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({}).sort({ createdAt: -1 });
        res.status(200).json({ transactions });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

const freezeUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isFrozen = !user.isFrozen;
        await user.save();

        res.status(200).json({
            message: user.isFrozen ? "User frozen" : "User unfrozen",
            isFrozen: user.isFrozen
        });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = { getAllUsers, getAllTransactions, freezeUser };