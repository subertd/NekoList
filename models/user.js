/**
 * Created by Donald on 5/22/2015.
 */

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

var User = mongoose.model("User", userSchema);

module.exports = User;