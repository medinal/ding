var db = require("../models");

//Get all courses
function all(req, res){
  var userId = req.query.userId;
  var allCourses= [];
  db.Course.find({})
    .populate('teacher')
    .cursor()
    .on('data', function(doc){
      numSpots(doc)
      isTeaching(doc, userId)
      isEnrolled(doc, userId)
      allCourses.push(doc);
    })
    .on('end', function(){
      res.json(allCourses);
    })
};

//create a new course and populate it with a teacher
function create(req, res){
  var newCourse = {name: req.body.name,
                  teacher: req.body.userId,
                  description: req.body.description,
                  capacity: req.body.capacity,
                  spotsLeft: req.body.capacity};
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
  var courseId = req.body.courseId;
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
  var courseId = req.body.courseId;
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

function isTeaching(course, userId){
  if(userId == course.teacher._id){
    course.isTeacher = true;
  }
};

function isEnrolled(course, userId){
  db.Enroll.find({user: userId, course: course._id}, function(err, res){
    if(res.length > 0){
      course.isEnroll = true;
    }
  });
};

function numSpots(course){
  db.Enroll.find({course: course._id}, function(err, res){
    course.spotsLeft = course.capacity - res.length
  })
}

module.exports = {
  all: all,
  create: create,
  edit: edit,
  remove: remove
};
