const express = require("express");
const insertController = require('../controllers/insert');
const deleteController = require('../controllers/delete');
const editController = require('../controllers/edit')
const demoController = require('../controllers/demo')
const authContoller = require('../controllers/auth');
const userMiddleware = require('../middleware/users');

const router = express.Router();

//Authentication Post Methods
router.post('/register', userMiddleware.validateUser, authContoller.registerUser);
router.post('/login', authContoller.loginUser);
router.post('/editAccount',editController.editAccount)
router.post('/editPassword', editController.editPassword)

//Controller Insert.js
router.post('/adddevice', insertController.addDevice);
router.post('/addplant', insertController.addPlant);
router.post('/configureplant',insertController.configurePlant);
router.post('/insertplant',insertController.insertPlant)
router.post('/insertdevice',insertController.insertDevice)

//Controller Delete.js
router.post('/deleteDevice',deleteController.deleteDevice);
router.post('/deletePlant',deleteController.deletePlant);


//Controller demo.js
router.post('/generateMoisture/:plant_id', demoController.generateMoistureData)
router.post('/controlTemperature/:plant_id', demoController.controlTemperature)
router.post('/waterPlant/:plant_id',demoController.waterPlant)


module.exports = router;