var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const userController = require('../controller/userController')

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/signup',userController.signup);
router.post('/signin',userController.signin);
router.post('/updateUser',userController.updateUser);

module.exports = router;