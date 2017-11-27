"use strict";

var Q = require("q");
var mongoose = require("mongoose");
var validator = require('validator');
var Order = mongoose.model("Order");

const MODEL = [
  "id",
  "firstName",
  "lastName",
  "email",
  "phone",
  "products"
];

var self = {};

/**
 * Gets all the orders in the database.
 *
 * @returns {promise|*}   A promise object that contains these properties:
 *                        - err: indicates if there is an error (TRUE/FALSE);
 *                        - data: the list of the orders.
 */
self.getOrders = function() {
  var deferred = Q.defer();
  var filter = {};

  Order.find({}, { _id: 0 }).lean().exec(function(err, orders) {
    if (err) {
      deferred.resolve({ err: false, data: [] });
    } else {
      deferred.resolve({ err: false, data: orders });
    }
  });
  return deferred.promise;
};

/**
 * Gets the prder associated with the product ID specified.
 *
 * @param orderId         The order ID associated with the order to retrieve.
 * @returns {promise|*}   A promise object that contains these properties:
 *                        - err: indicates if there is an error (TRUE/FALSE);
 *                        - data: the order associated with the ID specified.
 */
self.getOrder = function(orderId) {
  var deferred = Q.defer();
  Order.findOne({ id: orderId }, { _id: 0 }).lean().exec(function(err, order) {
    if (err || !order) {
      deferred.resolve({ err: true, data: null });
    } else {
      deferred.resolve({ err: false, data: order });
    }
  });
  return deferred.promise;
};

/**
 * Creates an order in the database.
 *
 * @param order           The order to create in the database.
 * @returns {promise|*}   A promise object that indicates if an error occurred during the deletion (TRUE/FALSE).
 */
self.createOrder = function(order) {
  var deferred = Q.defer();
  var productsManager = require("./products");
  productsManager.getProducts().done(function(result) {
    var productsList = result.data;

    var isValid = MODEL.every(function(property) {
      return property in order;
    });
    if (!isValid) { // Missing properties
      deferred.resolve(true);
      return deferred.promise;
    }

    isValid &= !isNaN(order.id) && typeof order.id === "number";
    isValid &= !!validator.trim(order.firstName);
    isValid &= !!validator.trim(order.lastName);
    isValid &= validator.isEmail(order.email);
    isValid &= validator.isMobilePhone(validator.whitelist(order.phone, "0123456789"), "en-CA");
    isValid &= order.products instanceof Array && order.products.every(function(product) {
      var productIsValid = true;
      productIsValid &= "id" in product;
      productIsValid &= "quantity" in product;
      if (!productIsValid) {
        return false;
      }
      productIsValid &= !isNaN(product.id) && typeof order.id === "number";
      productIsValid &= productsList.find(function(d) { return d.id === product.id; }) !== undefined;
      productIsValid &= !isNaN(product.quantity) && typeof product.quantity === "number" && product.quantity > 0;
      return productIsValid;
    });
    if (!isValid) { // Invalid data
      deferred.resolve(true);
      return deferred.promise;
    }

    self.getOrder(order.id).done(function(result) {
      if (result.data === null) {
        new Order(order).save(function(err) {
          deferred.resolve(err);
        });
      } else {
        deferred.resolve(true);
      }
    });
  });
  return deferred.promise;
};

/**
 * Deletes the order associated with the specified ID in the database.
 *
 * @param orderId         The order ID associated with the order to delete.
 * @returns {promise|*}   A promise object that indicates if an error occurred during the deletion (TRUE/FALSE).
 */
self.deleteOrder = function(orderId) {
  var deferred = Q.defer();
  Order.findOne({ id: orderId }).lean().exec(function(err, product) {
    if (err || !product) {
      deferred.resolve(true);
    } else {
      Order.remove({ id: orderId }, function(err) {
        deferred.resolve(err);
      });
    }
  });
  return deferred.promise;
};

/**
 * Deletes all the orders in the database.
 *
 * @returns {promise|*}   A promise object that indicates if an error occurred during the deletion (TRUE/FALSE).
 */
self.deleteOrders = function() {
  var deferred = Q.defer();
  Order.remove({}, function (err) {
    deferred.resolve(err);
  });
  return deferred.promise;
};

module.exports = self;
