var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  userName: {type: String, default: "admin"},
  password: {type: String, default: "admin"},
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
