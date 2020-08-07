const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/isAuth');

const authController = require('../contollers/auth');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/logout', authController.logout);

router.get('/profile', authController.getProfile);

router.post('/profile', authController.postProfile);

router.get('/', isAuth, authController.dashboard);

module.exports = router;
