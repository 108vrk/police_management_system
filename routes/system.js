const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/isAuth');

const systemController = require('../contollers/system');

router.get('/', isAuth, systemController.getSystem);

router.post('/', isAuth, systemController.postSystem);

module.exports = router;
