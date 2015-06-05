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

/* get all users */
router.get("/", function(req, res) {

  var query = User.find({}).select({"passwordHash": false});

  query.exec(function(err, users) {
    if (err) {
      var message = "Unable to retrieve users from persistent memory";
      console.log(message, err);
      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify({ success: false, message: message, error: err }));
    }

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(users));
  });
});

/* get a single user */
router.get("/:id", function(req, res) {

  var query = User.findOne({"_id": req.params["id"]}).select({"passwordHash": false});

  query.exec(function(err, user) {
    if (err) {
      var message = "Unable to retrieve user from persistent memory";
      console.log(message, err);
      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify({ success: false, message: message, error: err }));
    }

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(user));
  });
})

/* insert a new user and log in */
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
        console.log(message, err);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({ success: false, message: message, error: err }));
      }

      var session = sessions.createSession(user.id);

      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify({
        'success': true,
        'id': user._id,
        'userName': user.userName,
        'token': session.token,
        'expiration': session.expiration
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
      console.log(message, err);
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
        console.log(message, err);
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