var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var EnrollSchema = new Schema({
  name: String,
  course: String,
  user: String
});

var Enroll = mongoose.model('Enroll', EnrollSchema);

module.exports = Enroll;
