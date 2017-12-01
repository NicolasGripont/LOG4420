"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var config = require('./config.json');

var Order = new Schema({
  id: { type: Number, unique: true },
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  products: Array
}, { versionKey: false });


var Product = new Schema({
  id: { type: Number, unique: true },
  name: String,
  price: Number,
  image: String,
  category: String,
  description: String,
  features: Array
}, { versionKey: false });

mongoose.model("Order", Order);
mongoose.model("Product", Product);

mongoose.Promise = global.Promise;

// DB connexion
var dbConfig = config.database;
var dbOptions = {useMongoClient: true};
mongoose.connect('mongodb://' + dbConfig.username + ':' + dbConfig.password + '@' +
  dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.name, dbOptions, function (error) {

  if(error) {
    console.log("Database error when mongoose.connect : ", error);
  }
});
