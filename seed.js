//seed.js

var db = require("./models");

var userList = [{name: "Logan"},{name: "Will"}, {name: "Michelle"}, {name: "Nathan"}, {name: "Ali"}];

var courseList = [];

courseList.push({
  name: "Competitive Knitting",
  description: "Learn to use your knitting needles for combat.",
  teacher: "Logan",
  capacity: 10,
  spotsLeft: 10,
});

courseList.push({
  name: "Ladders",
  description: "Climb up, climb down.",
  teacher: "Logan",
  capacity: 5,
  spotsLeft: 5,
});

courseList.push({
  name: "Introduction to Collaborative Passive Aggression",
  description: "You know what you did.",
  teacher: "Will",
  capacity: 25,
  spotsLeft: 25,
});

courseList.push({
  name: "Faking It, Until You Make It",
  description: "We don't know what we're doing, either.",
  teacher: "Will",
  capacity: 18,
  spotsLeft: 18
});

courseList.push({
  name: "Underwater Sleeping",
  description: "We'll make you an offer you can't refuse.",
  teacher: "Will",
  capacity: 13,
  spotsLeft: 13
});


db.Course.remove({}, function(err, courses){
  db.User.remove({}, function(err, courses){
    db.User.create(userList, function(err, users){
      courseList.forEach(function(courseData){
        var course = new db.Course({
          name: courseData.name,
          description: courseData.description,
          capacity: courseData.capacity,
          spotsLeft: courseData.spotsLeft
        });
        db.User.findOne({name: courseData.teacher}, function (err, foundUser){
          if(err){return console.log(err);}
          course.teacher = foundUser;
          course.save(function(err, savedCourse){
            if(err){return console.log(err);}
            return console.log('completed')
          })
        })
      })
    })
  })
});
