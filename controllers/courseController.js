var db = require("../models");

//Get all courses
function all(req, res){
  db.Course.find({}, function(err, course){
    if(err){console.log(err);}
    res.json(course);
  })
}

module.exports = {
  all: all
};
