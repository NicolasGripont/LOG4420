"use strict";

var Q = require("q");
var productsManager = require("./products");

const MODEL = [
  "productId",
  "quantity"
];

var self = {};
var items = [];

/**
 * Initializes the shopping cart in the session.
 *
 * @param session
 */
self.initialize = function(session) {
  if (!session.items) {
    session.items = [];
  }
  items = session.items;
};

/**
 * Gets all the items in the shopping cart.
 *
 * @return {Array}  An array that contains the items.
 */
self.getItems = function() {
  return items;
};

/**
 * Gets the item associated with the specified product ID.
 *
 * @param productId   The product ID associted with the item to retrieve.
 * @return {object}   The item associated with the product ID specified.
 */
self.getItem = function(productId) {
  return items.find(function(item) {
    return item.productId === parseInt(productId);
  });
};

/**
 * Adds a new item in the shopping cart.
 *
 * @param item          The item to add in the shopping cart.
 * @return {*|promise}  A promise that contains if an error occurred during the operation (TRUE/FALSE).
 */
self.addItem = function(item) {
  var deferred = Q.defer();

  var isValid = MODEL.every(function(property) {
    return property in item;
  });
  if (!isValid) {
    deferred.resolve(true);
    return deferred.promise;
  }

  isValid &= !isNaN(item.productId) && typeof item.productId === "number";
  isValid &= !isNaN(item.quantity) && typeof item.quantity === "number" && item.quantity >= 0;
  if (!isValid) {
    deferred.resolve(true);
    return deferred.promise;
  }

  productsManager.getProduct(item.productId).done(function(result) {
    var itemFound = items.find(function(element) {
      return element.productId === item.productId;
    });
    if (result.data !== null && !itemFound) {
      items.push(item);
      deferred.resolve(false);
    } else {
      deferred.resolve(true);
    }
  });
  return deferred.promise;
};

/**
 * Updates the quantity associated with the product ID specified.
 *
 * @param productId   The product ID associated with the item to update.
 * @param quantity    The quantity to use.
 * @return {number}   A number that indicates the status of the operation:
 *                    - 0: The operation was completed successfully;
 *                    - 1: The product ID specified doesn't exist in the shopping cart;
 *                    - 2: The quantity specified is invalid.
 */
self.updateItemQuantity = function(productId, quantity) {
  var item = items.find(function(item) {
    return item.productId === parseInt(productId);
  });
  if (!item) {
    return 1;
  }
  if (!isNaN(quantity) && typeof quantity === "number" && quantity >= 0) {
    item.quantity = quantity;
    return 0;
  } else {
    return 2;
  }
};

/**
 * Deletes the item associated with the product ID specified.
 *
 * @param productId   The product ID associated with the item to delete.
 * @return {boolean}  A boolean that indicates if an error occurred during the operation (TRUE/FALSE).
 */
self.deleteItem = function(productId) {
  var index = items.findIndex(function(item) {
    return item.productId === parseInt(productId);
  });
  if (index === -1) {
    return true;
  }
  items.splice(index, 1);
  return false;
};

/**
 * Deletes all the items in the shopping cart.
 */
self.deleteItems = function() {
  items.splice(0, items.length);
};

module.exports = self;
