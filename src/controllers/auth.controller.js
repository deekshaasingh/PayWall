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
    res.json({
        message: "signup is working properly"
    })
}

module.exports = {login, signup};