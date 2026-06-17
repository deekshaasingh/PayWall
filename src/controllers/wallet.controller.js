const User = require('../models/user.model');
const Transaction = require('../models/transaction.model'); 

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

const transferMoney = async (req, res) => {
    const amount = req.body.amount;

    const receiverEmail = req.body.receiverEmail;

    const receiver = await User.findOne({
        email: receiverEmail
    });

    if (!receiver){
        return res.send("Invalid Receiver");
    }

    const sender = await User.findById(req.userId);

    if (amount > sender.balance) {
    return res.send("Insufficient balance");
}

    sender.balance = sender.balance - amount;
    receiver.balance = receiver.balance + amount;

    await receiver.save();
    await sender.save();

    res.json({
    message: "Transfer successful",
    amount: sender.balance
})
}

module.exports = {
    getWallet, updateBalance, transferMoney
};