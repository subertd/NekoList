/**
 * Created by Donald on 6/3/2015.
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var List = require('../models/list');

var sessions = require('../classes/Sessions');

var host = "http://" +
  process.env.OPENSHIFT_ENV_VAR ? "http://nodejs-subertd.rhcloud.com/" : "localhost";

/* get all the items for a list, if authorized */
router.get("/", function(req, res) {
  res.setHeader("content-type", "application/json");
  res.send(JSON.stringify({test:"TEST TEST TEST", listId:req.params["listId"]}));
});

/* get a particular list item, if authorized */
router.get("/:itemId", function(req, res) {
  res.setHeader("content-type", "application/json");
  res.send(JSON.stringify({listId: req.params["listId"], itemId: req.params["itemId"], req:req.params}));
});

module.exports = router;