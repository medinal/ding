//seed.js

var db = require("./models");

var courseList =[];

courseList.push({
  name: "Competitive Knitting",
  teacherName: "Professor Professorson",
  description: "Learn to use your knitting needles for combat.",
  capacity: 10
});

courseList.push({
  name: "Ladders",
  teacherName: "Professor Cheng",
  description: "Climb up, climb down.",
  capacity: 5
});

courseList.push({
  name: "Introduction to Collaborative Passive Aggression",
  teacherName: "Michelle",
  description: "You know what you did.",
  capacity: 25
});

courseList.push({
  name: "Faking It, Until You Make It",
  teacherName: "Logan",
  description: "We don't know what we're doing, either.",
  capacity: 18
});

courseList.push({
  name: "Underwater Sleeping",
  teacherName: "Vito Corleone",
  description: "We'll make you an offer you can't refuse.",
  capacity: 13
});



db.Course.remove({}, function(err, courses){
  // code in here runs after all classes are removed
  db.Course.create(courseList, function(err, courses){
    // code in here runs after all classes are created
    if (err) { return console.log('ERROR', err); }
    console.log("all courses:", courses);
    console.log("created", courses.length, "courses");
    process.exit();
  });
});
