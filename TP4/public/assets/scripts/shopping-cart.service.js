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

  /**
   * Adds an item in the shopping cart.
   *
   * @param productId   The ID associated with the product to add.
   * @param [quantity]  The quantity of the product.
   */
  self.addItem = function(productId, quantity, callback) {
    self.getItem(productId, function(product) {
      if(product) {
        self.updateItemQuantity(productId, product.quantity + quantity, function() {
          callback();
        });
      } else {
        self.addNewItem(productId, quantity, callback);
      }
    });
  };

  self.addNewItem = function(productId, quantity, callback) {
    $.ajax({
      url: "/api/shopping-cart",
      type: "POST",
      dataType: "json",
      data: {
        productId: productId,
        quantity: quantity
      }
    })
    .done(function () {
      callback();
    })
    .fail(function (xhr, status, errorThrown) {
    });
  };

  self.getItem = function(productId, callback) {
    $.ajax({
      url: "/api/shopping-cart/" + productId,
      type: "GET",
      dataType : "json"
    })
    .done(function(product) {
      callback(product);
    })
    .fail(function(xhr, status, errorThrown) {
      callback(null);
    });
  };

  /**
   * Gets the items in the shopping cart.
   *
   * @returns {jquery.promise}    A promise that contains the list of items in the shopping cart.
   */
  self.getItems = function(callback) {

    $.ajax({
      url: "/api/shopping-cart",
      type: "GET",
      dataType : "json"
    })
    .done(function(products) {
      var items = [];
      if(products.length === 0) {
        callback([]);
      } else {
        products.forEach(function(obj) {
          productsService.getProduct(obj.productId, function(productInDb) {
            var productInShoppingCart = {product : productInDb, quantity : obj.quantity, total : productInDb.price * obj.quantity};
            items.push(productInShoppingCart);
            // TODO : Voir comment améliorer avec les asynchrone
            if(items.length === products.length) {
              callback(items);
            }
          });
        });
      }
    })
    .fail(function(xhr, status, errorThrown) {
      callback([]);
    });
  };

  /**
   * Gets the items count in the shopping cart.
   *
   * @returns {number}  The items count.
   */
  self.getItemsCount = function(callback) {
    var total = 0;
    self.getItems(function(products) {
      products.forEach(function(item) {
        if (item) {
          total += item.quantity;
        }
      });
      callback(total);
    });
  };

  /**
   * Gets the quantity associated with an item.
   *
   * @param productId   The product ID associated with the item quantity to retrieve.
   * @returns {*}
   */
  self.getItemQuantity = function(productId, callback) {
    $.ajax({
      url: "/api/shopping-cart/" + productId,
      type: "GET",
      dataType : "json"
    })
    .done(function(product) {
      callback(product.quantity);
    })
    .fail(function(xhr, status, errorThrown) {
      callback(null);
    });
  };

  /**
   * Gets the total amount of the products in the shopping cart.
   *
   *  {jquery.promise}    A promise that contains the total amount.
   */
  self.getTotalAmount = function(callback) {
    var total = 0;
    self.getItems(function(products) {
      products.forEach(function(item) {
        if (item) {
          total += item.total;
        }
      });
      callback(total);
    });
  };


  /**
   * Updates the quantity associated with a specified item.
   *
   * @param productId   The product ID associated with the item to update.
   * @param quantity    The item quantity.
   */
  self.updateItemQuantity = function(productId, quantity, callback) {

    $.ajax({
      url: "/api/shopping-cart/" + productId,
      type: "PUT",
      dataType : "json",
      data : {
        quantity : quantity
      }
    })
    .done(function() {
      callback();
    });
  };

  /**
   * Removes the specified item in the shopping cart.
   *
   * @param productId   The product ID associated with the item to remove.
   */
  self.removeItem = function(productId, callback) {
    $.ajax({
      url: "/api/shopping-cart/" + productId,
      type: "DELETE",
      dataType : "json"
    })
    .done(function() {
      callback();
    });

  };

  /**
   * Removes all the items in the shopping cart.
   */
  self.removeAllItems = function(callback) {
    $.ajax({
      url: "/api/shopping-cart",
      type: "DELETE",
      dataType : "json"
    })
    .done(function(){
      callback();
    });
  };

  return self;
})(jQuery, onlineShop.productsService);
