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
                  teacher: req.params.userId
                  description: req.body.description,
                  capacity: req.body.capacity};
  db.Course.create(newCourse, function(err, course){
    if(err){console.log(err);}
    res.json(course);
  })
};

function edit(req, res){
  var courseId = req.params.courseId;
  var updatedCourse = {name: req.body.name,
                  description: req.body.description,
                  capacity: req.body.capacity};
  db.Course.findByIdAndUpdate(courseId, updatedCourse, {new: true}, function(err, course){
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
