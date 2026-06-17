const User = require('../models/user.model');

const getWallet = async (req, res) => {

    const user = await User.findById(req.userId);

    res.json({
        balance: user.balance
    });

}

module.exports = {
    getWallet
};