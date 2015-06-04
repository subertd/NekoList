/**
 * Created by Donald on 5/25/2015.
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

/**
 * @augments mongoose.Model
 */
var Thing = require('../models/thing');

/* GET sample JSON things from the server */

/* get all the things */
router.get("/", function(req, res) {

  var query = Thing.find({});

  query.exec(function(err, things) {
    if (err) {
      throw err;
    }

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(things));
  });
});

/* get the thing by id */
router.get("/:id", function(req, res) {

  var query = Thing.find({
    "_id": req.params["id"]
  });

  query.exec(function(err, thing) {
    if (err) {
      throw err;
    }

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(thing));
  });
});

/* insert a new thing */
router.post("/", function(req, res) {

  var data = req.body;

  var newThing = Thing({
    'foo': data.foo,
    'bar': data.bar,
    'baz': data.baz,
    'createdOn': Date.now(),
    'editedOn': null
  });

  newThing.save(function(err, thing) {
    if (err) {
      throw err;
    }

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify({
      'success': true,
      'thing': thing
    }));
  });
});

/* update an existing thing */
router.put("/:id", function(req, res) {

  Thing.findOne({ "_id": req.params["id"] }, function(err, thing) {

    var data = req.body;

    thing.foo = data['foo'];
    thing.bar = data['bar'];
    thing.baz = data['baz'];
    thing.editedOn = Date.now();

    thing.save(function(err, thing) {
      if (err) {
        throw err;
      }

      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify({
        'success': true,
        'thing': thing
      }));
    });
  });
});

/* delete a thing */
router.delete("/:id", function(req, res) {

  Thing.findOneAndRemove({"_id": req.params["id"]}, function (err) {
    if (err) {
      throw err;
    }

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify({
      "success": true
    }));
  });
});

module.exports = router;