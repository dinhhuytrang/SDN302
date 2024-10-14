const express = require('express');
const { getUsers, createUser,changePassword } = require('../controllers/userController');
const authenticateToken = require('../middleware/auth.middleware');
const UserRouter = express.Router();

UserRouter.get('/', getUsers); 
UserRouter.post('/', createUser); 




UserRouter.post('/changepw', authenticateToken, changePassword);




module.exports = UserRouter;