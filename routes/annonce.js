var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const annonceController = require('../controller/annonceController')

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/getAllAnnonce',annonceController.getAllAnnonce);
router.post('/getAnnonceByUser',annonceController.getAnnonceByUser);

router.post('/addAnnonce',annonceController.addAnnonce);
router.post('/deleteAnnonce',annonceController.deleteAnnonce);


module.exports = router;