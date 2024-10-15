const express = require('express');
const { getUsers, createUser,changePassword, verifyEmail } = require('../controllers/userController');
const authenticateToken = require('../middleware/auth.middleware');
const UserRouter = express.Router();

UserRouter.get('/', getUsers); 
UserRouter.post('/register', createUser); 
UserRouter.get('/verify-email', verifyEmail); 




UserRouter.post('/changepw', authenticateToken, changePassword);




module.exports = UserRouter;