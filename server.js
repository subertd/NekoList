/**
 * Created by Donald on 4/1/2015.
 *
 * Maintenance Log:
 *  4/2/2015 Converted to an express server; added a route to handle bad
 *  addresses; Validated with JSLint
 *
 *  4/11/2015 Added ejs and routed a test template file;
 *  Added mongoose and models for categories and notes;
 *  Implemented adding categories
 *  Implemented adding and editing notes
 */

"use strict";

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');

/*jslint node: true, stupid: true */
fs.readdirSync(__dirname + "/models").forEach(function (filename) {
  require(__dirname + "/models/" + filename);
});

/*jslint node: true, stupid: true */
fs.readdirSync(__dirname + "/routes").forEach(function (filename) {
  require(__dirname + "/routes/" + filename);
});


/**
 * class ExpressWebserver
 *
 * @constructor
 * @method start, starts the express webserver
 */
function ExpressWebserver() {

  var app = null;

  var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
  var port = process.env.OPENSHIFT_NODEJS_PORT || 1337;

  var mongoDbConnectionString = "127.0.0.1:27017/NodeNote";

  var htmlPrefix = "<!doctype html><html><head>" +
    "<meta charset='utf-8'><title>CS496 - Cloud/Mobile Development</title>" +
    "</head><body>";

  var htmlSuffix = "</body></html>";

  var initializeServer = function () {
    app = express();
  };

  var useBodyParsing = function () {
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(express.urlencoded());
  };

  var initializeRoutes = function () {

    // Hello Cloud
    app.get('/', function (req, res) {

      var date = new Date();

      res.writeHead(200, {'content-type': 'text/html'});
      res.write(htmlPrefix);
      res.write('<h1>Hello Cloud</h1>');
      res.write('<h4>This page was loaded: ' + date + '</h4>');
      res.write(htmlSuffix);
      res.end();
    });

    //
    // NODE NOTE
    //
    app.get("/ctrl_panel", function (req, res) {
      mongoose.model("categories").find(function (err, categories) {
        mongoose.model("notes").find(function (err, notes) {
          res.render("ctrl_panel", {
            categories: categories,
            notes: notes
          });
        });
      });
    });

    app.post('/add_category', function (req, res) {
      var form_data = req.body;
      var Category = mongoose.model('categories');
      new Category({
        name: form_data.name
      }).save(function (err, doc) {
        if (err) {
          res.json(err);
        } else {
          res.redirect("/ctrl_panel");
        }
      });
    });

    app.get('/new_note_form', function (req, res) {
      mongoose.model("categories").find(function (err, categories) {
        res.render("new_note_form", {
          categories: categories
        });
      });
    });

    app.post('/add_note', function (req, res) {
      var form_data = req.body;
      console.log("form_data", JSON.stringify(form_data));

      // Resolve Category
      var Category = mongoose.model("categories");
      Category.findById(form_data.category, function (err, category) {

        // Resolve Note
        var Note = mongoose.model('notes');
        var note = new Note({
          title: form_data.title,
          description: form_data.description,
          category: category,
          public: form_data.public === "on",
          body: form_data.body
        });
        note.save(function (err, doc) {

          // After insert
          if (err) {
            res.json(err);
          } else {
            res.redirect("/ctrl_panel");
          }
        });
      });
    });

    app.get("/notes/:noteId", function (req, res) {

      // Resolve note
      mongoose.model("notes").findOne(
        { _id: req.params.noteId },
        function (err, note) {
          console.log("note: ", note);

          // Resolve category
          mongoose.model("categories").findById(note.category,
            function (err, category) {
              console.log("category: " + category);

              // Display
              if (err) {
                res.redirect("/error/" + JSON.stringify(err));
              } else {
                res.render('note_detail', {
                  note: note,
                  category: category
                });
              }
            });
        }
      );
    });

    app.get("/edit_note_form/:noteId", function (req, res) {
      mongoose.model("categories").find(function (err, categories) {
        mongoose.model("notes").findOne(
          {_id: req.params.noteId},
          function (err, note) {

            if (note.category) {
              // Mark a category as checked
              categories.forEach(function (category) {
                //console.log("category._id.id: '" + category._id.id
                //  + "'; note.category.id: '" + note.category.id + "'");
                if (category._id.id == note.category.id) {
                  console.log("Match: " + category._doc.name);
                  category.checked = true;
                }
              });
            }

            console.log("categories: ", JSON.stringify(categories));

            // Display
            if (err) {
              res.redirect("/error/" + JSON.stringify(err));
            } else {
              res.render('edit_note_form', {
                categories: categories,
                note: note
              });
            }
          }
        );
      });
    });

    app.post('/edit_note/:noteId', function (req, res) {
      var form_data = req.body;
      console.log("form_data: " + JSON.stringify(form_data));

      // Resolve Category
      var Category = mongoose.model("categories");
      Category.findById(form_data.category, function (err, category) {
        console.log("category: ", category);

        // Resolve Note
        var Note = mongoose.model('notes');
        Note.findById(req.params.noteId, function (err, note) {

          // Update Note
          note.update({
            title: form_data.title,
            description: form_data.description,
            category: category,
            public: form_data.public === "on",
            body: form_data.body
          }, {}, function (err, doc) {

            // After update
            if (err) {
              res.redirect('error/' + JSON.stringify(err));
            } else {
              res.redirect("/notes/" + form_data._id);
            }
          });
        });
      });
    });
    //

    // Error display
    app.get('/error/:error', function (req, res) {
      res.send(req.params.error);
    });

    app.get('/*', function (req, res) {
      res.writeHead(200, {'content-type': 'text/html'});
      res.write(htmlPrefix);
      res.write("<h4>Error: The page requested could not be found</h4>");
      res.write(htmlSuffix);
      res.end();
    });
  };

  var enableEjs = function () {
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
  };

  var enableMongoose = function () {
    //mongoose.connect('mongodb://127.0.0.1:27017/smidgeon');
    if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
      mongoDbConnectionString =
        process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
    }

    mongoose.connect(mongoDbConnectionString);
  };

  var beginListening = function () {
    var server = app.listen(port, ipaddress, function () {
      var _port = server.address().port;
      var _ipaddress = server.address().address;

      console.log('Listening on: http://' + _ipaddress + ':' + _port);
    });
  };

  return {
    start: function () {
      initializeServer();
      useBodyParsing();
      initializeRoutes();
      enableEjs();
      enableMongoose();
      beginListening();
    }
  };
}

new ExpressWebserver().start();