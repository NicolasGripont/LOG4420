var onlineShop = onlineShop || {};

/**
 * Defines a service to manage the shopping cart.
 *
 * @author Antoine Beland <antoine.beland@polymtl.ca>
 * @author Konstantinos Lambrou-Latreille <konstantinos.lambrou-latreille@polymtl.ca>
 */
onlineShop.shoppingCartService = (function($, productsService) {
  "use strict";

  var self = {};
  var items = {};

  /**
   * Adds an item in the shopping cart.
   *
   * @param productId   The ID associated with the product to add.
   * @param [quantity]  The quantity of the product.
   */
  self.addItem = function(productId, quantity) {
    if (productId === undefined) {
      throw new Error("The specified product ID is invalid.")
    }
    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      quantity = 1;
    }
    if (items[productId]) {
      items[productId] += quantity;
    } else {
      items[productId] = quantity;
    }
    _updateLocalStorage();
  };

  /**
   * Gets the items in the shopping cart.
   *
   * @returns {jquery.promise}    A promise that contains the list of items in the shopping cart.
   */
  self.getItems = function() {
    return productsService.getProducts("alpha-asc").then(function(products) {
      return products.filter(function(product) {
        return items.hasOwnProperty(product.id) && items[product.id] !== undefined;
      }).map(function(product) {
        return {
          product: product,
          quantity: items[product.id],
          total: product.price * items[product.id]
        };
      });
    });
  };

  /**
   * Gets the items count in the shopping cart.
   *
   * @returns {number}  The items count.
   */
  self.getItemsCount = function() {
    var total = 0;
    for (var productId in items) {
      if (items.hasOwnProperty(productId) && items[productId]) {
        total += items[productId];
      }
    }
    return total;
  };

  /**
   * Gets the quantity associated with an item.
   *
   * @param productId   The product ID associated with the item quantity to retrieve.
   * @returns {*}
   */
  self.getItemQuantity = function(productId) {
    return items[productId] || 0;
  };

  /**
   * Gets the total amount of the products in the shopping cart.
   *
   * @returns {jquery.promise}    A promise that contains the total amount.
   */
  self.getTotalAmount = function() {
    return self.getItems().then(function(items) {
      var total = 0;
      items.forEach(function(item) {
        if (item) {
          total += item.total;
        }
      });
      return total;
    });
  };

  /**
   * Updates the quantity associated with a specified item.
   *
   * @param productId   The product ID associated with the item to update.
   * @param quantity    The item quantity.
   */
  self.updateItemQuantity = function(productId, quantity) {
    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      throw new Error("The specified quantity is invalid.")
    }
    if (items[productId]) {
      items[productId] = quantity;
      _updateLocalStorage();
    }
  };

  /**
   * Removes the specified item in the shopping cart.
   *
   * @param productId   The product ID associated with the item to remove.
   */
  self.removeItem = function(productId) {
    if (items[productId]) {
      items[productId] = undefined;
    }
    _updateLocalStorage();
  };

  /**
   * Removes all the items in the shopping cart.
   */
  self.removeAllItems = function() {
    items = {};
    _updateLocalStorage();
  };

  /**
   * Updates the shopping cart in the local storage.
   *
   * @private
   */
  function _updateLocalStorage() {
    localStorage["shoppingCart"] = JSON.stringify(items);
  }

  // Initializes the shopping cart.
  if (localStorage["shoppingCart"]) {
    items = JSON.parse(localStorage["shoppingCart"]);
  }

  return self;
})(jQuery, onlineShop.productsService);
