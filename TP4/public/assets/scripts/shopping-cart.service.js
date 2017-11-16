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
    /*if (productId === undefined) {
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
    _updateLocalStorage();*/

    $.ajax({
      url: "/api/shopping-cart",
      type: "POST",
      dataType : "json",
      data : {
        productId : productId,
        quantity : quantity
      }
    })
    .done(function() {
      callback();
    })
    .fail(function(xhr, status, errorThrown) {
    });

  };

  /**
   * Gets the items in the shopping cart.
   *
   * @returns {jquery.promise}    A promise that contains the list of items in the shopping cart.
   */
  self.getItems = function(callback) {
    /*return productsService.getProducts("alpha-asc").then(function(products) {
      return products.filter(function(product) {
        return items.hasOwnProperty(product.id) && items[product.id] !== undefined;
      }).map(function(product) {
        return {
          product: product,
          quantity: items[product.id],
          total: product.price * items[product.id]
        };
      });
    });*/

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
      /*for(var test in products) {
        if (test) {
          total += test.quantity;
        }
      }*/
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
    /*return self.getItems().then(function(items) {
      var total = 0;
      items.forEach(function(item) {
        if (item) {
          total += item.total;
        }
      });
      return total;
    });*/
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
    /*if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      throw new Error("The specified quantity is invalid.")
    }
    if (items[productId]) {
      items[productId] = quantity;
      _updateLocalStorage();
    }*/

    //TODO : Voir comment améliorer l'appel (surtout le .fail)
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
    /*if (items[productId]) {
      items[productId] = undefined;
    }
    _updateLocalStorage();*/

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
    //items = {};
    //_updateLocalStorage();
    //_updateLocalStorage();

    $.ajax({
      url: "/api/shopping-cart",
      type: "DELETE",
      dataType : "json"
    })
    .done(function(){
      callback();
    });
  };

  /**
   * Updates the shopping cart in the local storage.
   *
   * @private
   */
  /*function _updateLocalStorage() {
    localStorage["shoppingCart"] = JSON.stringify(items);
  }

  // Initializes the shopping cart.
  /*if (localStorage["shoppingCart"]) {
    items = JSON.parse(localStorage["shoppingCart"]);
  }*/

  return self;
})(jQuery, onlineShop.productsService);
