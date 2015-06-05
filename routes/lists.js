/**
 * Created by Donald on 6/3/2015.
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var List = require('../models/list');

var sessions = require('../classes/Sessions');

var host = "http://" + (process.env.OPENSHIFT_NODEJS_IP || "localhost");

/* get all the lists for a user if authorized*/
router.get("/", function(req, res) {

  var userId = req.headers["userid"];
  var token = req.headers["token"];

  if (sessions.verifyToken(userId, token)) {

    var query = List.find({
      owner: userId
    });

    query.exec(function(err, lists) {
      if (err) {
        var message = "Unable to get lists from persistent memory";
        console.log(message, err);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({ success: false, message: message, error: err }));
        return;
      }

      // Add Hypermedia
      lists.forEach(function(list) {
        list._doc.listURL = host + "/lists/" + list._id;
        list._doc.ownerURL = host + "/users/" + list.owner;
        list._doc.itemsURL = host + "/lists/" + list._id + "/items";
      });

      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify(lists));
    });
  }
  else {
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify({ success: false, message: "Invalid UserId or Token" }));
  }
});

/* get the list by id if authorized */
router.get("/:id", function(req, res) {

  var userId = req.headers["userid"];
  var token = req.headers["token"];

  var listId = req.params["id"];

  if (sessions.verifyToken(userId, token)) {

    var query = List.findOne({
      owner: userId,
      "_id": listId
    }).populate("owner");

    query.exec(function (err, list) {
      if (err) {
        var message = "Unable to get list from persistent memory";
        console.log(message, err);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({ success: false, message: message, error: err }));
        return;
      }

      if (!list) {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({
          success: false,
          message: "Either the resource does not exist or access is not authorized"
        }));
        return;
      }

      // Add Hypermedia
      list._doc.ownerUrl = host + "/users/" + list.owner;
      list._doc.itemsUrl = host + "/lists/" + listId + "/items";

      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify(list));
    });
  }
  else {
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify({ success: false, message: "Invalid UserId or Token"}));
  }
});

/* insert a new list for an authenticated user*/
router.post("/", function(req, res) {

  var userId = req.headers["userid"];
  var token = req.headers["token"];

  if (sessions.verifyToken(userId, token)) {
    var data = req.body;

    var newList = List({
      'owner': userId,
      'name': data.name
    });

    newList.save(function (err, list) {
      if (err) {
        var message = "Unable to persist list";
        console.log(message, err);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({success: false, message:message, error: err}));
        return;
      }

      // add hypermedia
      list._doc.ownerURL = host + "/users/" + list._doc.owner;

      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify({
        success: true,
        list: list
      }));
    });
  }
  else {
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify({
      success: false,
      message: "Invalid User Id or Token"
    }));
  }
});

/* update a list, if authorized */
router.put("/:id", function(req, res) {

  var userId = req.headers["userid"];
  var token = req.headers["token"];

  var listId = req.params["id"];

  if (sessions.verifyToken(userId, token)) {

    var query = List.findOne({
      owner: userId,
      "_id": listId
    }).populate("owner");

    query.exec(function(err, list) {

      list._doc.name = req.body.name;

      list.save(function(err, list) {
        if (err) {
          var message = "Unable to persist updated list";
          console.log(message, err);
          res.setHeader("content-type", "application/json");
          res.send(JSON.stringify({success: false, message: message, error: err}));
          return;
        }

        res.setHeader("content-type", "application/json");
        res.send(list);
      });
    });
  }
  else {
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify({
      success: false,
      message: "Invalid UserId or Token"
    }));
  }
})

/* delete a list, if authorized */
router.delete("/:id", function(req, res) {

  var userId = req.headers["userid"];
  var token = req.headers["token"];

  var listId = req.params["id"];

  if (sessions.verifyToken(userId, token)) {

    var query = List.findOne({
      owner: userId,
      "_id": listId
    }).remove();

    query.exec(function (err) {
      if (err) {
        var message = "Unable to delete list from persistent memory";
        console.log(message, err);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({success: false, message: message, error: err}));
        return;
      }

      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify({success:true}));
    });
  }
  else {
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify({success: false, message: "Invalid UserId or Token"}));
  }
});

/* show all the items in a list, if authorized */
router.get("/:id/items", function(req, res) {

  var userId = req.headers["userid"];
  var token = req.headers["token"];

  var listId = req.params["id"];

  if (sessions.verifyToken(userId, token)) {

    var query = List.findOne({
      owner: userId,
      "_id": listId
    });

    query.exec(function (err, list) {
      if (err) {
        var message = "Unable to get list from persistent memory";
        console.log(message, err);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({ success: false, message: message, error: err }));
        return;
      }

      if (!list) {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({
          success: false,
          message: "Either the resource does not exist or access is not authorized"
        }));
        return;
      }

      var listItems = list._doc.items;

      // Add Hypermedia
      listItems.forEach(function(item) {
        item.itemURL = host + "/items/" + item._id;
      })

      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify(listItems));
    });
  }
  else {
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify({ success: false, message: "Invalid UserId or Token"}));
  }
});

/* insert a new item into a list, if authorized */
router.post("/:id/items", function(req, res) {

  var userId = req.headers["userid"];
  var token = req.headers["token"];

  var listId = req.params["id"];

  if (sessions.verifyToken(userId, token)) {
    var data = req.body;

    var query = List.findOne({
      owner: userId,
      "_id": listId
    }).populate("owner");

    query.exec(function(err, list) {
      if (err) {
        var message = "Unable to get list from persistent memory";
        console.log(message, err);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({ success: false, message: message, error: err }));
        return;
      }

      if (!list) {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({
          success: false,
          message: "Either the list resource does not exist or access is not authorized"
        }));
        return;
      }

      console.log("List Before Push: " + list);

      list.items.push({
        name: req.body["name"],
        quantity: req.body["quantity"],
        check: false
      });

      console.log("List After Push: " + list);

      list.save(function(err, list) {
        if (err) {
          var message = "Unable save appended list to persistent memory";
          console.log(message, err);
          res.setHeader("content-type", "application/json");
          res.send(JSON.stringify({success: false, message: message, error: err}));
          return;
        }

        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(list));
      });
    });
  }
  else {
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify({
      success: false,
      message: "Invalid User Id or Token"
    }));
  }
});

/* get a single item in a list, if authorized */
router.get("/:listId/items/:itemId", function(req, res) {

  var userId = req.headers["userid"];
  var token = req.headers["token"];

  var listId = req.params["listId"];
  var itemId = req.params["itemId"]

  if (sessions.verifyToken(userId, token)) {
    var data = req.body;

    var query = List.findOne({
      owner: userId,
      "_id": listId
    }).populate("owner");

    query.exec(function(err, list) {
      if (err) {
        var message = "Unable to get list from persistent memory";
        console.log(message, err);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({ success: false, message: message, error: err }));
        return;
      }

      var item = null;
      list._doc.items.forEach(function(i) {
        if (i._id == itemId) {
          item = i;
        }
      });

      if (!item) {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({
          success: false,
          message: "The item resource does not exist"
        }));
        return;
      }

      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify(item));
    });
  }
  else {
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify({
      success: false,
      message: "Invalid User Id or Token"
    }));
  }
});

/* update an item in a list, if authorized */
router.put("/:listId/items/:itemId", function(req, res) {

  var userId = req.headers["userid"];
  var token = req.headers["token"];

  var listId = req.params["listId"];
  var itemId = req.params["itemId"]

  if (sessions.verifyToken(userId, token)) {
    var data = req.body;

    var query = List.findOne({
      owner: userId,
      "_id": listId
    }).populate("owner");

    query.exec(function(err, list) {
      if (err) {
        var message = "Unable to get list from persistent memory";
        console.log(message, err);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({ success: false, message: message, error: err }));
        return;
      }

      if (!list) {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({
          success: false,
          message: "Either the list resource does not exist or access is not authorized"
        }));
        return;
      }

      var item = null;
      list._doc.items.forEach(function(i) {
        if (i._id == itemId) {
          item = i;
        }
      });

      if (!item) {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({
          success: false,
          message: "The item resource does not exist"
        }));
        return;
      }

      item.quantity = data.quantity;
      item.name = data.name;
      item.check = data.check;

      list.save(function(err, list) {
        if (err) {
          var message = "Unable to update list to persistent memory";
          console.log(message, err);
          res.setHeader("content-type", "application/json");
          res.send(JSON.stringify({ success: false, message: message, error: err }));
          return;
        }

        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(item));
      });
    });
  }
  else {
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify({
      success: false,
      message: "Invalid User Id or Token"
    }));
  }
});

/* delete an item from a list, if authorized */
router.delete("/:listId/items/:itemId", function(req, res) {

  var userId = req.headers["userid"];
  var token = req.headers["token"];

  var listId = req.params["listId"];
  var itemId = req.params["itemId"]

  if (sessions.verifyToken(userId, token)) {
    var data = req.body;

    var query = List.findOne({
      owner: userId,
      "_id": listId
    }).populate("owner");

    query.exec(function (err, list) {
      if (err) {
        var message = "Unable to get list from persistent memory";
        console.log(message, err);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({success: false, message: message, error: err}));
        return;
      }

      if (!list) {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({
          success: false,
          message: "Either the list resource does not exist or access is not authorized"
        }));
        return;
      }

      var found = false;
      for (var i = 0; i < list._doc.items.length; ++i) {
        if (list._doc.items[i]._id = itemId) {
          list._doc.items.splice(i, 1);
          found = true;
        }
      }

      if (!found) {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({
          success: false,
          message: "The item resource does not exist"
        }));
        return;
      }

      list.save(function(err, list) {
        if (err) {
          var message = "Unable to delete item from persistent memory";
          console.log(message, err);
          res.setHeader("content-type", "application/json");
          res.send(JSON.stringify({success: false, message: message, error: err}));
          return;
        }

        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({ success:true }));
      });
    });
  }
  else {
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify({
      success: false,
      message: "Invalid User Id or Token"
    }));
  }
});

module.exports = router;