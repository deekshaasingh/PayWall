const User = require('../models/user.model');

const getWallet = async (req, res) => {

    const user = await User.findById(req.userId);

    res.json({
        balance: user.balance
    });
}

const updateBalance = async (req, res) => {
    const user = await User.findById(req.userId);
    const amount = req.body.amount;
    user.balance = user.balance + amount;

    await user.save();
    res.json({
    message: "Money added successfully!",
    balance: user.balance
})
}

module.exports = {
    getWallet, updateBalance
};