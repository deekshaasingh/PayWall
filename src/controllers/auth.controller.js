const User = require('../models/user.model');
const signupSchema = require('../validators/auth.validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    const token = jwt.sign(
        {
            userId: loggedUser._id,
        },

        process.env.JWT_SECRET, {
            expiresIn: "1h"
        }
    )

    console.log(token)
    

    if(isMatch){
        res.json({
        message: "User logged in successfully!",
        token: token
})
    }
    
    else res.send("User does not exist!");

    console.log(isMatch);
}

module.exports = {login, signup};