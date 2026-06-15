const express = require('express');
const authController = require('../controllers/auth.controller')

const authMiddleware = require('../middleware/auth.middleware');


const router = express.Router();

router.post('/login', authController.login)

router.post('/signup', authController.signup)

router.get('/wallet', authMiddleware, (req,res)=>{
    console.log(req.userId);

    res.send("Wallet Route");
})

module.exports = router;