const express = require('express');
<<<<<<< HEAD
const { getUsers, signin, createUser, changePassword, verifyEmail, resetAccount } = require('../controllers/userController');
=======
const { getUsers, createUser, changePassword, verifyEmail, resetAccount } = require('../controllers/userController');
>>>>>>> main
const authenticateToken = require('../middleware/auth.middleware');
const UserRouter = express.Router();

UserRouter.get('/', getUsers);
<<<<<<< HEAD
UserRouter.post('/login', signin);
UserRouter.post('/register', createUser);
UserRouter.get('/verify-email', verifyEmail);
UserRouter.post('/resetPassword', resetAccount);
UserRouter.post('/changepw', authenticateToken, changePassword);

module.exports = UserRouter;
=======
UserRouter.post('/register', createUser);
UserRouter.get('/verify-email', verifyEmail);
UserRouter.post('/resetPassword', resetAccount)




UserRouter.post('/changepw', authenticateToken, changePassword);




module.exports = UserRouter;
>>>>>>> main
