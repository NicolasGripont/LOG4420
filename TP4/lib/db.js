"use strict";

var mongoose = require("mongoose");

var Order = require('../models/order');
var Product = require('../models/product');

mongoose.Promise = global.Promise;

var config = require('../config.json');

// DB connexion
var dbConfig = config.database;
var dbOptions = {useMongoClient: true};
mongoose.connect('mongodb://' + dbConfig.username + ':' + dbConfig.password + '@' +
  dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.name, dbOptions, function (error) {

  if(error) { //TODO
    console.log("Database error when mongoose.connect : ", error);
  }
});
