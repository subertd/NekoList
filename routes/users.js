/**
 * Created by Donald on 5/22/2015.
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var passwordHasher = require('../classes/PasswordHasher');

var sessions = require('../classes/Sessions');

/**
 * @augments mongoose.Model
 */
var User = require('../models/user');

/* GET sample JSON users from the server */

/* get all users */
router.get("/", function(req, res) {

  var query = User.find({}).select({"passwordHash": false});

  query.exec(function(err, users) {
    if (err) {
      throw err;
    }

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(users));
  });
});

/* insert a new user */
router.post("/", function(req, res) {

  var userName = req.headers["username"];
  var password = req.headers["password"];

  passwordHasher.hashPassword(password, function(passwordHash) {

    var newUser = User({
      'userName': userName,
      'passwordHash': passwordHash
    });

    newUser.save(function(err, user) {
      if (err) {
        var message = "Unable to persist new user";
        console.log(message);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({
          success: false,
          message: message,
          error: err
        }));
      }

      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify({
        'success': true,
        'id': user._id,
        'userName': user.userName
      }));
    });
  });
});

/* log the user in if supplied the right password */
router.post("/logIn", function(req, res) {

  var userName = req.headers["username"];
  var password = req.headers["password"];

  User.findOne({ "userName": userName }, function(err, user) {
    if(err) {
      var message = "Unable to search users collection";
      console.log(message);
      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify({ success: false, message:message, error: err }));
    }

    if (!user) {
      var message = "Unable to find user for userName '" + userName + "'";
      console.log(message);
      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify({ success:false, message:message }));
    }

    passwordHasher.comparePasswordToHash(password, user.passwordHash, function(err, success) {
      if(err) {
        var message = "unable to compare passwords";
        console.log(message);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({ success: false, message:message, error: err }));
      }

      if (success) {
        var session = sessions.createSession(user.id);
        session.success = true;
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(session));
      }
      else {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({ success: false, message: "Incorrect User Name or Password" }));
      }

    });
  });
});

module.exports = router;