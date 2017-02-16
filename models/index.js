var mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/ding");

module.exports.Class = require("./course.js");
