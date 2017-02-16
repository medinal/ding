var db = require("../models");

function all(req, res){
  db.Enroll.find({})
    .populate(['course','user'])
    .exec(function(err, enroll){
      if(err){console.log(err);}
      res.json(enroll);
    })
};

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

function unenroll(req, res){
  db.Enroll.find({user: {_id: req.params.userId}, course: {_id: req.params.courseId}}, function(err, enrollment){
    db.Enroll.findByIdAndRemove(enrollment[0]._id, function(err, unenroll){
      if(err){console.log(err);}
      res.json(unenroll);
    })
  })
}

function removeCourse(req, res){
  db.Enroll.remove({course: { _id: req.params.courseId}})
          .exec(function(err, unenroll){
              if(err){console.log(err);}
              res.json(unenroll)
  })
}

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
