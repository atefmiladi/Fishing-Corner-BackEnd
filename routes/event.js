var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const eventController = require('../controller/eventController')

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/addEvent',eventController.addEvent);
router.post('/getAllEvent',eventController.getAllEvent);
router.post('/addOrDeleteParticipation',eventController.addOrDeleteParticipation);
router.post('/deleteEvent',eventController.deleteEvent);

module.exports = router;