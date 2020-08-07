const express = require('express');
const route = express.Router();

const isAuth = require('../middleware/isAuth');

const citizenController = require('../contollers/citizen');

route.get('/', isAuth, citizenController.getCitizens);

route.post('/add', isAuth, citizenController.addCitizen);

route.post('/edit', isAuth, citizenController.editCitizen);

route.get('/delete/:id', isAuth, citizenController.deleteCitizen);

route.get('/excel', isAuth, citizenController.getExcel);


module.exports = route;