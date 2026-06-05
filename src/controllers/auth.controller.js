const User = require('../models/user.model');
const signupSchema = require('../validators/auth.validator');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    console.log(req.body.email);
    console.log(req.body.password);

    res.json({
        message: "login is working properly"
    })
}

const signup = async (req, res) => {
    const result = signupSchema.safeParse(req.body);
    console.log(result)

    const existingUser = await User.findOne({
        email: req.body.email
    });

    const hashedPassword = await bcrypt.hash(
        req.body.password,
        10
    )

    req.body.password = hashedPassword;

    const user = new User(req.body);

    if(existingUser){
        res.send("Email is already registered!");
    }

    const savedUser = await user.save();

    console.log(user);
    res.json({
        message: "signup is working properly"
    })
    
}

module.exports = {login, signup};