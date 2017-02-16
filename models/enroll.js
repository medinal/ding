var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var EnrollSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

var Enroll = mongoose.model('Enroll', EnrollSchema);

module.exports = Enroll;
