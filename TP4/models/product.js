var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Product = new Schema({
  id: { type: Number, unique: true },
  name: String,
  price: Number,
  image: String,
  category: String,
  description: String,
  features: Array
}, { versionKey: false });

module.exports = mongoose.model("Product", Product);
