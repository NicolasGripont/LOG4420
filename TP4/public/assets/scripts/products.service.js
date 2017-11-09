var onlineShop = onlineShop || {};

/**
 * Defines a service to retrieve the products.
 *
 * @author Antoine Beland <antoine.beland@polymtl.ca>
 * @author Konstantinos Lambrou-Latreille <konstantinos.lambrou-latreille@polymtl.ca>
 */
onlineShop.productsService = (function($) {
  "use strict";

  var self = {};


  self.getProducts = function (sortingCriteria, category, callback) {
    if(category === "all") {
      category = "";
    }
    $.ajax({
      url: "/api/products",
      type: "GET",
      dataType : "json",
      data : {
        "criteria" : sortingCriteria,
        "category" : category
      }
    })
    .done(function(products) {
      callback(products);
    })
    .fail(function(xhr, status, errorThrown) {
      callback([]);
    });
  }

  /**
   * Gets the product associated with the product ID specified.
   *
   * @param productId           The product ID associated with the product to retrieve.
   * @returns {jquery.promise}  A promise that contains the product associated with the ID specified.
   */
  // self.getProduct = function(productId) {
  //   return self.getProducts().then(function(products) {
  //     var product = products.filter(function(product) {
  //       return product.id === productId;
  //     });
  //     if (product.length > 0) {
  //       return product[0];
  //     } else {
  //       return null;
  //     }
  //   });
  // };

  self.getProduct = function(productId, callback) {
    $.ajax({
      url: "/api/products/" + productId,
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


  return self;
})(jQuery);
