

var express = require('express');
var app = express();


var bodyParser = require("body-parser");
app.use(bodyParser.json());

var mongoose = require('mongoose');
var mongodbUrl = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/myappdatabase';
mongoose.connect(mongodbUrl);

var lists = require('./routes/lists');
app.use('/lists', lists);

var users = require('./routes/users');
app.use('/users', users);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.get("/", function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    usersURL:server_ip_address + ":" + server_port + "/users",
    listsURL:server_ip_address + ":" + server_port + "/lists"
  }));
});

console.log("IP_ADDRESS: " + server_ip_address);
console.log("PORT: " + server_port);

var server = app.listen(server_port, server_ip_address, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});