const express = require('express');
const { getUsers, createUser,changePassword, resetAccount } = require('../controllers/userController');
const authenticateToken = require('../middleware/auth.middleware');
const UserRouter = express.Router();

UserRouter.get('/', getUsers); 
UserRouter.post('/', createUser); 
UserRouter.post('/resetPassword',resetAccount)



UserRouter.post('/changepw', authenticateToken, changePassword);




module.exports = UserRouter;