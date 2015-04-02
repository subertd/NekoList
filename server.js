/**
 * Created by Donald on 4/1/2015.
 *
 * Maintenance Log:
 *  4/2/2015 Converted to an express server; added a route to handle bad
 *  addresses; Validated with JSLint
 */

"use strict";

var express = require('express');

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

  var htmlPrefix = "<!doctype html><html><head>" +
    "<meta charset='utf8'><title>CS496 - Cloud/Mobile Development</title>" +
    "</head><body>";

  var htmlSuffix = "</body></html>";

  var initializeServer = function () {
    app = express();
  };

  var initializeRoutes = function () {
    app.get('/', function (req, res) {

      var date = new Date();

      res.writeHead(200, {'content-type': 'text/html'});
      res.write(htmlPrefix);
      res.write('<h1>Hello Cloud</h1>');
      res.write('<h4>This page was loaded: ' + date + '</h4>');
      res.write(htmlSuffix);
      res.end();
    });

    app.get('/*', function (req, res) {
      res.writeHead(200, {'content-type': 'text/html'});
      res.write(htmlPrefix);
      res.write("<h4>Error: The page requested could not be found</h4>");
      res.write(htmlSuffix);
      res.end();
    });
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
      initializeRoutes();
      beginListening();
    }
  };
}

new ExpressWebserver().start();