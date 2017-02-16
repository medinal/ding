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

//create a new course and populate it with a teacher
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

//edit a previously existing course. Can only edit name, description and capacity.
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

//remove a course from the courses database and remove all enrollments that exist for that course.
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
