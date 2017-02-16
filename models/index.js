var mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/ding");

module.exports.Course = require("./course.js");
module.exports.User = require("./user.js");
module.exports.Enroll = require("./enroll.js")
