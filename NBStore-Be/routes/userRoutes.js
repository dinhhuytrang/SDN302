const express = require('express');
const { getUsers, signin, createUser, changePassword, verifyEmail, resetAccount } = require('../controllers/userController');
const authenticateToken = require('../middleware/auth.middleware');
const UserRouter = express.Router();

UserRouter.get('/', getUsers);
UserRouter.post('/login', signin);
UserRouter.post('/register', createUser);
UserRouter.get('/verify-email', verifyEmail);
UserRouter.post('/resetPassword', resetAccount);
UserRouter.post('/changepw', authenticateToken, changePassword);

module.exports = UserRouter;
