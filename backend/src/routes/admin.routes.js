const express = require('express');
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

router.get('/users', authMiddleware, adminMiddleware, adminController.getAllUsers);
router.get('/transactions', authMiddleware, adminMiddleware, adminController.getAllTransactions);
router.patch('/freeze/:id', authMiddleware, adminMiddleware, adminController.freezeUser);

module.exports = router;