const User = require('../models/user.model');
const signupSchema = require('../validators/auth.validator');
const bcrypt = require('bcryptjs');

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

const login = async (req, res) => {

    const loggedUser = await User.findOne({
        email: req.body.email
    })

    if(!loggedUser){
        res.send("User does not exist!");
    }

    const isMatch = await bcrypt.compare(req.body.password, loggedUser.password);

    if(isMatch){
        res.send("User logged in successfully!");
    }
    
    else res.send("User does not exist!");

    console.log(isMatch);

    res.json({
        message: "login is working properly"
    })
}

module.exports = {login, signup};