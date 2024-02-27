const createError = require('http-errors');
const express = require('express');
const session = require("express-session");
const passport = require("passport");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require("./db/db");

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth').router;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//AUTHENTICATION w/ PASSPORT
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


//ROUTERS
app.use('/', indexRouter);
app.use('/auth', authRouter);


//connect to DB
(async () => {
  try {
      await db.connect();
      console.log('Connected to the database');
  } catch (error) {
      console.error('Failed to connect to the database:', error);
      process.exit(1); // Exit the application if database connection fails
  }
})();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
