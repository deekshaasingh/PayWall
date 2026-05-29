const User = require('../models/user.model');
const signupSchema = require('../validators/auth.validator');

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

    const user = new User(req.body);

    const savedUser = await user.save();

console.log(savedUser.collection.name);

    console.log(user);
    res.json({
        message: "signup is working properly"
    })
    
}

module.exports = {login, signup};