const express = require('express');
const authController = require('../controllers/auth.controller')
const walletController = require('../controllers/wallet.controller');

const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/login', authController.login)

router.post('/signup', authController.signup)

router.get(
    '/wallet',
    authMiddleware,
    walletController.getWallet
);

module.exports = router;