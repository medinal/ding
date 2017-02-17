var db = require("../models");

//show all users
function all(req, res){
  db.User.find({}, function(err, user){
    if(err){console.log(err);}
    res.json(user);
  })
};

//create a new user
function create(req, res){
  var newUser = {name: req.body.name};
  db.User.create(newUser, function(err, user){
    if(err){console.log(err);}
    res.json(user);
  })
};

module.exports = {
  all: all,
  create: create
};
