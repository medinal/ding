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
app.use(express.static('vendor'));

var db = require('./models');

var controllers = require('./controllers');


app.get('/', function homepage(req, res) {
   res.sendFile(__dirname + '/views/index.html');
});

//***************
//*Course Routes*
//***************

//get all courses
app.get('/courses', controllers.course.all);
//create a new course
app.post('/courses/:userId', controllers.course.create);
//edit an existing course
app.put('/courses/:courseId', controllers.course.edit);
//remove a course and all enrollment from that course
app.delete('/courses/:courseId', controllers.course.remove);


//***************
//*User Routes*
//***************

//get all user data
app.get('/users', controllers.user.all);
//create a new user
app.post('/users', controllers.user.create);


//***************
//*Enroll Routes*
//***************

//get all enrollment for every user
app.get('/enrolls', controllers.enroll.all);
//get all enrollment for a single user
app.get('/enrolls/:userId', controllers.enroll.allOne);
//enroll a single student in a single class
app.post('/enrolls/:userId/:courseId', controllers.enroll.create);
//unenrolls a student from a class
app.delete('/enrolls/:userId/:courseId', controllers.enroll.unenroll);
//cancels a class and removes all enrollment
app.delete('/enrolls/:courseId', controllers.enroll.removeCourse);


//************************
//*Setup Server to Listen*
//************************

app.listen(process.env.PORT || 3000, function () {
   console.log('Express server is up and running on http://localhost:3000/');
});
