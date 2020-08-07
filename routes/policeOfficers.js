const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/isAuth');

const policeOfficersController = require('../contollers/policeOfficers');

router.get('/', isAuth, policeOfficersController.getpoliceOfficers);

router.post('/add', isAuth, policeOfficersController.addPoliceOfficer);

router.get('/delete/:id', isAuth, policeOfficersController.deletePoliceOfficer);

router.post('/edit', isAuth, policeOfficersController.editPoliceOfficer); 

router.get('/excel', isAuth, policeOfficersController.getExcel);


module.exports = router;
