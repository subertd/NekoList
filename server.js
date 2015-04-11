/**
 * Created by Donald on 4/1/2015.
 *
 * Maintenance Log:
 *  4/2/2015 Converted to an express server; added a route to handle bad
 *  addresses; Validated with JSLint
 *
 *  4/11/2015 Added ejs and routed a test template file
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
    "<meta charset='utf-8'><title>CS496 - Cloud/Mobile Development</title>" +
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
    
    app.get('/test', function (req, res) {
      res.render('test', { title: 'ejs' });
    });
  
    app.get('/*', function (req, res) {
      res.writeHead(200, {'content-type': 'text/html'});
      res.write(htmlPrefix);
      res.write("<h4>Error: The page requested could not be found</h4>");
      res.write(htmlSuffix);
      res.end();
    });
  };
  
  var enableEjs = function() {
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
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
      enableEjs();
      beginListening();
    }
  };
}

new ExpressWebserver().start();