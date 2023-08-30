const express = require("express");
const userMiddleware = require('../middleware/users');
const display = require('../controllers/display');
const authContoller = require('../controllers/auth');

const router = express.Router();


//Checks if user is logged in
router.get('*', userMiddleware.checkUser);

//Routes for all pages 
router.get('/',userMiddleware.requireAuth, display.displayDashboard, (req, res) => {res.render('index')});
router.get('/startup',userMiddleware.requireAuth, (req, res) => {res.render('startup')});
router.get('/register', (req, res) => {res.render('register')});
router.get('/login', (req, res) => {res.render('login')});
router.get('/about', (req, res) => {res.render('about')});
router.get('/feedback', (req, res) => {res.render('feedback')});
router.get('/logout',authContoller.logoutUser);

//Routes for Search Plants and Moisture Data View
router.get('/plantinfo',userMiddleware.requireAuth, display.displayPlantInfo, (req, res) => {res.render('plantinfo')});
router.get('/planttype',userMiddleware.requireAuth, display.displayPlantType,(req, res) => {res.render('planttype')});
router.get('/planttype/:id',userMiddleware.requireAuth, display.displayPlantInfo,(req,res) => {res.render('plantinfo')});
router.get('/moistureview',userMiddleware.requireAuth, display.displayGraph, (req, res) => {res.render('moistureview')});
router.get('/moistureview/:plant_id',userMiddleware.requireAuth, display.displayGraph, (req, res) => {res.render('moistureview')});

router.get('/adddevice',userMiddleware.requireAuth, display.displayDevices, (req, res) => {res.render('adddevice')});
router.get('/insertplant',userMiddleware.requireAuth, (req, res) => {res.render('insertplant')});
router.get('/insertdevice',userMiddleware.requireAuth, (req, res) => {res.render('insertdevice')});
router.get('/configure',userMiddleware.requireAuth, display.displayConfigurePlant, (req, res) => {res.render('configure')});
router.get('/settings',userMiddleware.requireAuth, display.displayAccount, (req, res) => {res.render('settings')});






module.exports = router;