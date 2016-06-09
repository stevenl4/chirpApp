var session = require('express-session');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

require('./models/models.js');
var mongoose = require('mongoose');
if(process.env.DEV_ENV){
    console.log('we\'re in developement!');
    mongoose.connect('mongodb://localhost:27017/test-chirp');
}
else{
    console.log('we\'re live!');
    mongoose.connect('mongodb://admin:admin@ds023213.mlab.com:23213/chirp-demo');
}



var app = express();

var index = require('./routes/index');
var api = require('./routes/api');
var authenticate = require('./routes/authenticate');

// view engine setup  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({
    secret: 'keyboard cat',
    rolling: true,
    resave: true,
    saveUninitialized: false
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

var initPassport = require('./passport-init');
initPassport(passport);
app.use('/', index);
app.use('/api', api);
app.use('/auth', authenticate(passport));

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
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
