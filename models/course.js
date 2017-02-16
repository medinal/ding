var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CourseSchema = new Schema({
  name: String,
  teacherName: String,
  teacherId: String,
  description: String,
  capacity: Number
});

var Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
