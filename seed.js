//seed.js

var db = require("./models");

var courseList =[

];


db.Course.remove({}, function(err, courses){
  // code in here runs after all classes are removed
  db.Course.create(courseList, function(err, course){
    // code in here runs after all classes are created
    if (err) { return console.log('ERROR', err); }
    console.log("all courses:", course);
    console.log("created", course.length, "courses");
    process.exit();
  });
});
