const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/isAuth');

const firController = require('../contollers/fir');

router.get('/', isAuth, firController.getFirs);

router.get('/add', isAuth, firController.getAddFir);

router.get('/getOfficers/:id', isAuth, firController.getOfficers);

router.post('/add', isAuth, firController.postAddFir);

router.get('/delete/:id', isAuth, firController.deleteFir);

router.get('/edit/:id', isAuth, firController.getEditFir)

router.post('/edit', isAuth, firController.postEditFir)

router.get('/view/:id', isAuth, firController.viewFir)

router.get('/print/:id', isAuth, firController.printFir)

router.get('/excel', isAuth, firController.getExcel);




/* router.get('/logout', authController.logout);

router.get('/profile', authController.getProfile);

router.post('/profile', authController.postProfile);
 */

module.exports = router;
