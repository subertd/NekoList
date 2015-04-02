/**
 * Created by Donald on 4/1/2015.
 */
var host = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 1337;

var http = require('http');

http.createServer(function(req, res) {
  console.log('Receiving an http request', req);

  // Get the date and time
  var date = new Date();

  // Write the response
  res.writeHead(200, {'content-type': 'text/html'});
  res.write('<h1>Hello Cloud</h1>');
  res.write('<h4>This page was loaded: ' + date + '</h4>');
  res.end();

  console.log('Sending http response', res);
  }).listen(port, host);
console.log('Server running at http://' + host + ':' + port + '/');