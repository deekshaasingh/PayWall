const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

const getWallet = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.status(200).json({ balance: user.balance });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

const updateBalance = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const amount = req.body.amount;
        user.balance = user.balance + amount;

        await user.save();

        res.status(200).json({
            message: "Money added successfully!",
            balance: user.balance
        });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

const transferMoney = async (req, res) => {
    try {
        const amount = req.body.amount;
        const receiverEmail = req.body.receiverEmail;

        const receiver = await User.findOne({ email: receiverEmail });

        if (!receiver) {
            return res.status(404).json({ message: "Invalid receiver" });
        }

        const sender = await User.findById(req.userId);

        if (amount > sender.balance) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        sender.balance = sender.balance - amount;
        receiver.balance = receiver.balance + amount;

        await receiver.save();
        await sender.save();

        const transaction = new Transaction({
            sender: sender.email,
            receiver: receiver.email,
            amount,
            status: "completed"
        });

        await transaction.save();

        res.status(200).json({
            message: "Transfer successful",
            balance: sender.balance
        });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getTransactionHistory = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        const transactions = await Transaction.find({
            $or: [
                { sender: user.email },
                { receiver: user.email }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json({ transactions });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getInsights = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        const now = new Date();
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

        const thisWeekSentTx = await Transaction.find({
            sender: user.email,
            createdAt: { $gte: sevenDaysAgo, $lte: now }
        });

        const lastWeekSentTx = await Transaction.find({
            sender: user.email,
            createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
        });

        const thisWeekSent = thisWeekSentTx.reduce((sum, tx) => sum + tx.amount, 0);
        const lastWeekSent = lastWeekSentTx.reduce((sum, tx) => sum + tx.amount, 0);

        let percentChange = 0;
        if (lastWeekSent > 0) {
            percentChange = Math.round(((thisWeekSent - lastWeekSent) / lastWeekSent) * 100);
        } else if (thisWeekSent > 0) {
            percentChange = 100;
        }

        const thisWeekReceivedTx = await Transaction.find({
            receiver: user.email,
            createdAt: { $gte: sevenDaysAgo, $lte: now }
        });

        const thisWeekReceived = thisWeekReceivedTx.reduce((sum, tx) => sum + tx.amount, 0);

        const allSentTx = await Transaction.find({ sender: user.email });

        const totals = {};
        allSentTx.forEach((tx) => {
            totals[tx.receiver] = (totals[tx.receiver] || 0) + tx.amount;
        });

        let topCounterparty = null;
        let topCounterpartyAmount = 0;

        for (const [email, amount] of Object.entries(totals)) {
            if (amount > topCounterpartyAmount) {
                topCounterparty = email;
                topCounterpartyAmount = amount;
            }
        }

        res.status(200).json({
            thisWeekSent,
            lastWeekSent,
            percentChange,
            thisWeekReceived,
            transactionCountThisWeek: thisWeekSentTx.length,
            topCounterparty,
            topCounterpartyAmount
        });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = {
    getWallet, updateBalance, transferMoney, getTransactionHistory, getInsights
};