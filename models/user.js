var findOrCreate = require('mongoose-find-or-create');

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
});

//Allows findOrCreate to be a possibility
UserSchema.plugin(findOrCreate);

var User = mongoose.model('User', UserSchema);

module.exports = User;
