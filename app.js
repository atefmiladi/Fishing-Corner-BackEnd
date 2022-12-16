var express = require('express');
var app = express();
const bodyParser = require('body-parser')
var db = require('./db');
var path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var UserRoute = require('./routes/user');
var AnnonceRoute = require('./routes/annonce');
var EventRoute = require('./routes/event');

app.use(express.static(path.join(__dirname, "/")));

app.use('/fcorner/user', UserRoute);
app.use('/fcorner/annonce', AnnonceRoute);
app.use('/fcorner/event', EventRoute);

module.exports = app;