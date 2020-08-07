const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/isAuth');

const policeStationsController = require('../contollers/policeStations');

router.get('/', isAuth, policeStationsController.getpoliceSations);

router.post('/add', isAuth, policeStationsController.addPoliceSations);

router.get('/delete/:id', isAuth, policeStationsController.deletePoliceSation);

router.post('/edit', isAuth, policeStationsController.editPoliceSation);

router.get('/officers/:id', isAuth, policeStationsController.getpoliceOfficers);

router.get('/excel', isAuth, policeStationsController.getExcel);


module.exports = router;
