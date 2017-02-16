//seed.js

var db = require("./models");

var userList =[];

userList.push({
  name: "Professor Professorson"
});

userList.push({
  Name: "Professor Cheng"
});

userList.push({
  name: "Michelle"
});

userList.push({
  name: "Logan"
});

userList.push({
  name: "Vito Corleone"
});



db.User.remove({}, function(err, users){
  // code in here runs after all classes are removed
  db.User.create(userList, function(err, users){
    // code in here runs after all classes are created
    if (err) { return console.log('ERROR', err); }
    console.log("all users:", users);
    console.log("created", users.length, "users");
    process.exit();
  });
});
