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


/* get the user by id */
/*
router.get("/:id", function(req, res) {

  var query = User.find({
      "_id": req.params["id"]
    })
    .select({
      "passwordHash": false
    });

  query.exec(function(err, user) {
    if (err) {
      throw err;
    }

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(user));
  });
});
*/

/* insert a new user */
router.post("/", function(req, res) {

  var data = req.body;
  var password = data.password;

  passwordHasher.hashPassword(password, function(passwordHash) {

    var newUser = User({
      'userName': data.userName,
      'passwordHash': passwordHash
    });

    newUser.save(function(err, user) {
      if (err) {
        throw err;
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

router.post("/:id", function(req, res) {

  var id = req.params["id"];
  var password = req.body["password"];

  User.findOne({ "_id": id }, function(err, user) {

    console.log(err, user);

    // TODO handle err

    passwordHasher.comparePasswordToHash(password, user.passwordHash, function(err, success) {
      // TODO handle err

      if (success) {
        var session = sessions.createSession(id);

        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(session));
      }
      else {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({
          success: false,
          error: "Incorrect Password"
        }));
      }

    });
  });
});

/* update an existing user */
/*
router.put("/:id", function(req, res) {

  User.findOne({ "_id": req.params["id"] }, function(err, user) {

    var data = req.body;

    user.name = data['name'];
    user.username = data['username'];
    user.password = data['password'];

    user.save(function(err, user) {
      if (err) {
        throw err;
      }

      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify({
        'success': true,
        'id': user._id,
        'username': user.name
      }));
    });
  });
});
*/

/* delete a user */
/*
router.delete("/:id", function(req, res) {

  User.find({ "_id": req.params["id"]}).remove(function(err, status) {
    if (err) {
      throw err;
    }

    console.log(status);

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify({
      "success": true
    }));
  });
});
*/

module.exports = router;