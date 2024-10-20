const express = require('express');
const { getUsers, signin, createUser, changePassword, verifyEmail, resetAccount } = require('../controllers/userController');
const authenticateToken = require('../middleware/auth.middleware');
const { UserController } = require('../controllers');
const UserRouter = express.Router();

UserRouter.get('/', UserController.getUsers);
UserRouter.post('/login', UserController.signin);
UserRouter.post('/register', UserController.createUser);
UserRouter.get('/verify-email', UserController.verifyEmail);
UserRouter.post('/resetPassword', UserController.resetAccount);
UserRouter.post('/changepw', authenticateToken, UserController.changePassword);

module.exports = UserRouter;
