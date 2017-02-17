var db = require("../models");

function all(req, res){
  db.Enroll.find({})
    .populate(['course','user'])
    .exec(function(err, enroll){
      if(err){console.log(err);}
      res.json(enroll);
    })
};

//get all of a single students enrollments
function allOne(req, res){
  db.Enroll.find({user:{_id: req.params.userId}})
    .populate('user')
    .populate({
      path: 'course',
      populate: {path: 'teacher'}
  })
    .exec(function(err, enrolled){
      if(err){console.log(err);}
      res.json(enrolled);
    })
  }

//create a new enrollment instance for a student in a specific course
function create(req, res){
  var newEnrollment = {course: req.body.courseId,
                      user: req.body.userId};
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
  db.Enroll.find({user: {_id: req.body.userId}, course: {_id: req.body.courseId}}, function(err, enrollment){
    db.Enroll.findByIdAndRemove(enrollment[0]._id, function(err, unenroll){
      if(err){console.log(err);}
      res.json(unenroll);
    })
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
  allOne: allOne,
  create: create,
  unenroll: unenroll,
  removeEnroll: removeEnroll
};
