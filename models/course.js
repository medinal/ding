var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var User = require('./user.js');

var CourseSchema = new Schema({
  name: String,
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  description: String,
  capacity: Number
});

var Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
