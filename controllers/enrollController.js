var db = require("../models");

function all(req, res){
  db.Enroll.find({})
    .populate(['course','user'])
    .exec(function(err, enroll){
      if(err){console.log(err);}
      res.json(enroll);
    })
};

//create a new enrollment instance for a student in a specific course
function create(req, res){
  var newEnrollment = {course: req.params.courseId,
                      user: req.params.userId};
  db.Enroll.create(newEnrollment, function(err, enroll){
    if(err){console.log(err);}
    db.Enroll.findById(enroll._id)
      .populate(['course','user'])
      .exec(function(err, enroll){
        if(err){console.log(err);}
        res.json(enroll);
      })
  })
};

//un-enroll a student from a course by student id and course id
function unenroll(req, res){
  db.Enroll.find({user: {_id: req.params.userId}, course: {_id: req.params.courseId}}, function(err, enrollment){
    db.Enroll.findByIdAndRemove(enrollment[0]._id, function(err, unenroll){
      if(err){console.log(err);}
      res.json(unenroll);
    })
  })
}

//remove all enrollments for a course by course id
function removeCourse(req, res){
  db.Enroll.remove({course: { _id: req.params.courseId}})
          .exec(function(err, unenroll){
              if(err){console.log(err);}
              res.json(unenroll)
  })
}

//remove a single enrollment by id
function removeEnroll(req, res){
  db.Enroll.findByIdAndRemove(req.params.enrollId, function(err, enroll){
    if(err){console.log(err);}
    res.json(enroll);
  })
}

module.exports = {
  all: all,
  create: create,
  unenroll: unenroll,
  removeCourse: removeCourse,
  removeEnroll: removeEnroll
};
