const login = async (req, res) => {
    console.log(req.body.email);
    console.log(req.body.password);

    res.json({
        message: "login is working properly"
    })
}

const signup = async (req, res) => {
    console.log(req.body.email);
    console.log(req.body.password);
    res.json({
        message: "login is working properly"
    })
}

module.exports = {login, signup};