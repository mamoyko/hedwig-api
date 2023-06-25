const express = require('express');
const router = new express.Router();
const UserController = require('../controllers/UserController');
const UsersValidation = require('../lib/validations/users-validation');
const Auth = require('../lib/validations/authentication-middleware');

router.post('/login',
    UsersValidation.login(),
    UserController.login,
);

router.put('/role/:user_id',
    Auth.isAuthenticated,
    Auth.isAdmin,
    UsersValidation.roleChange(),
    UserController.changeRole,
);

router.post('/admin',
    UsersValidation.login(),
    UserController.superUserAuth,
);

router.get('/me',
    Auth.isAuthenticated,
    UserController.getUserMe,
);

router.get('/logout',
    Auth.isAuthenticated,
    UserController.logout,
)

module.exports = router;
