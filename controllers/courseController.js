var db = require("../models");

//Get all courses
function all(req, res){
  db.Course.find({}, function(err, course){
    if(err){console.log(err);}
    res.json(course);
  })
};

function create(req, res){
  var newCourse = {name: req.body.name,
                  teacherName: req.body.teacherName,
                  teacherId: req.body.teacherId,
                  description: req.body.description,
                  capacity: req.body.capacity};
  db.Course.create(newCourse, function(err, course){
    if(err){console.log(err);}
    res.json(course);
  })
};

function edit(req, res){
  var courseId = req.params.id;
  var newCourse = {name: req.body.name,
                  teacherName: req.body.teacherName,
                  teacherId: req.body.teacherId,
                  description: req.body.description,
                  capacity: req.body.capacity};
  db.Course.findByIdAndUpdate(courseId, newCourse, {new: true}, function(err, course){
    if(err){console.log(err);}
    res.json(course);
  })
};

function remove(req, res){
  var courseId = req.params.id;
  db.Course.findByIdAndRemove(courseId, function(err, course){
    if(err){console.log(err);}
    res.json(course);
  })
};

module.exports = {
  all: all,
  create: create,
  edit: edit,
  remove: remove
};
