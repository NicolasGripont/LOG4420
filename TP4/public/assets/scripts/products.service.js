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


  /**
   * Gets all products associated with the category and order by the sortingCriteria
   * @param sortingCriteria     The sorting criteria of the products to retrieve.
   * @param category            The product category associated with the products to retrieve.
   * @param callback            Function called when result is gotten. Called with the json array of products if
   *                            success or an empty json array if fail as parameter.
   */
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
   * @param productId   The product ID associated with the product to retrieve.
   * @param callback    Function called when result is gotten. Called with the json of product if success or
   *                    null value if fail as parameter.
   */
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
