var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var mongodbUrl = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/myappdatabase';
mongoose.connect(mongodbUrl);

var routes = require('./routes/index');
var users = require('./routes/users');
var lists = require('./routes/lists');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/lists', lists);

app.get("/", function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    usersURL:server_ip_address + ":" + server_port + "/users",
    listsURL:server_ip_address + ":" + server_port + "/lists"
  }));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify({
      success:false,
      message:err.message,
      error:err
    }));
  });
}

// production error handler
// no stacktraces leaked to users
app.use(function(err, req, res, next) {
  res.setHeader("content-type", "application/json");
  res.send(JSON.stringify({
    success:false,
    message:err.message,
    error:err
  }));
});

module.exports = app;
