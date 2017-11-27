var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var path = require("path");
var session = require("express-session");

require("./lib/db");
var orders = require("./routes/orders");
var products = require("./routes/products");
var shoppingCart = require("./routes/shopping-cart");

var app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(logger("dev"));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// initialize the session
app.use(session({
  secret: 'log4420',
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/',
    maxAge: 1000 * 60 * 24, // 24 hours
    secure: false
  }
}));

// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

app.use("/api/shopping-cart", shoppingCart);
app.use("/api/orders", orders);
app.use("/api/products", products);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
