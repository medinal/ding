// require express and other modules
var express = require('express'),
    app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var mongoose = require('mongoose');

app.use(express.static('public'));

var db = require('./models');

var controllers = require('./controllers');


app.get('/', function homepage(req, res) {
   res.sendFile(__dirname + '/views/index.html');
});

app.listen(process.env.PORT || 3000, function () {
   console.log('Express server is up and running on http://localhost:3000/');
});
