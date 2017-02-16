var db = require("../models");

//Get all courses
function all(req, res){
  db.Course.find({})
    .populate('teacher')
    .exec(function(err, courses){
      if(err){console.log(err);}
      res.json(courses);
  })
};

function create(req, res){
  var newCourse = {name: req.body.name,
                  teacher: req.params.userId,
                  description: req.body.description,
                  capacity: req.body.capacity};
  db.Course.create(newCourse, function(err, course){
    if(err){console.log(err);}
    db.Course.findById(course._id)
      .populate('teacher')
      .exec(function(err, course){
        if(err){console.log(err);}
        res.json(course);
      })
  })
};

function edit(req, res){
  var courseId = req.params.courseId;
  var updatedCourse = {name: req.body.name,
                  description: req.body.description,
                  capacity: req.body.capacity};
  db.Course.findByIdAndUpdate(courseId, updatedCourse, {new: true}, function(err, course){
    if(err){console.log(err);}
    db.Course.findById(course._id)
      .populate('teacher')
      .exec(function(err, course){
        if(err){console.log(err);}
        res.json(course);
      })
  })
};

function remove(req, res){
  var courseId = req.params.courseId;
  db.Enroll.find({course: {_id: courseId}}, function(err, enrollment){
    enrollment.forEach(function(enrollValue){
      db.Enroll.findByIdAndRemove(enrollValue._id, function(err, unenroll){
        if(err){console.log(err);}
        })
      })
      db.Course.findByIdAndRemove(courseId, function(err, course){
        if(err){console.log(err);}
        res.json(course);
    })
  })
};

module.exports = {
  all: all,
  create: create,
  edit: edit,
  remove: remove
};
