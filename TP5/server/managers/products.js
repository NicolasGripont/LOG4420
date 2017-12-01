"use strict";

var Q = require("q");
var mongoose = require("mongoose");
var validator = require('validator');
var Product = mongoose.model("Product");

const CATEGORIES = [
  "cameras",
  "computers",
  "consoles",
  "screens"
];
const SORTING_CRITERIA = [
  "price-asc",
  "price-dsc",
  "alpha-asc",
  "alpha-dsc"
];
const MODEL = [
  "id",
  "name",
  "price",
  "image",
  "category",
  "description",
  "features"
];

var self = {};

/**
 * Gets all the products in the database. The list returned is based on the specified category and sorting criteria.
 *
 * @param [criteria]      The sorting criteria to use. If no value is specified (undefined), the list returned
 *                        is sorted with the "price-asc" criteria.
 * @param [category]      The category of the product. The default value is "all".
 * @returns {promise|*}   A promise object that contains these properties:
 *                        - err: indicates if there is an error (TRUE/FALSE);
 *                        - data: the list of the products.
 */
self.getProducts = function(criteria, category) {
  var deferred = Q.defer();
  var filter = {};

  if (category !== undefined) {
    if (CATEGORIES.indexOf(category) !== -1) {
      filter = { category: category };
    } else {
      deferred.resolve({ err: true, data: null });
      return deferred.promise;
    }
  }
  if (criteria === undefined) {
    criteria = SORTING_CRITERIA[0];
  } else {
    if (SORTING_CRITERIA.indexOf(criteria) === -1) {
      deferred.resolve({ err: true, data: null });
      return deferred.promise;
    }
  }

  Product.find(filter, { _id: 0 }).lean().exec(function(err, products) {
    if (err) {
      deferred.resolve({ err: false, data: [] });
    } else {
      deferred.resolve({ err: false, data: applySortingCriteria(products, criteria) });
    }
  });
  return deferred.promise;
};

/**
 * Gets the product associated with the product ID specified.
 *
 * @param productId       The product ID associated with the product to retrieve.
 * @returns {promise|*}   A promise object that contains these properties:
 *                        - err: indicates if there is an error (TRUE/FALSE);
 *                        - data: the product associated with the ID specified.
 */
self.getProduct = function(productId) {
  var deferred = Q.defer();
  Product.findOne({ id: productId }, { _id: 0 }).lean().exec(function(err, product) {
    if (err || !product) {
      deferred.resolve({ err: true, data: null });
    } else {
      deferred.resolve({ err: false, data: product });
    }
  });
  return deferred.promise;
};

/**
 * Creates a product in the database.
 *
 * @param product         The product to create in the database.
 * @returns {promise|*}   A promise object that indicates if an error occurred during the deletion (TRUE/FALSE).
 */
self.createProduct = function(product) {
  var deferred = Q.defer();

  var isValid = MODEL.every(function(property) {
    return property in product;
  });
  if (!isValid) {
    deferred.resolve(true);
    return deferred.promise;
  }

  isValid &= !isNaN(product.id) && validator.isInt(product.id.toString());
  isValid &= !!validator.trim(product.name);
  isValid &= !isNaN(product.price) && product.price >= 0;
  isValid &= !!validator.trim(product.image);
  isValid &= CATEGORIES.indexOf(product.category) !== -1;
  isValid &= !!validator.trim(product.description);
  isValid &= product.features instanceof Array && product.features.every(function(feature) {
    return !!validator.trim(feature);
  });
  if (!isValid) {
    deferred.resolve(true);
    return deferred.promise;
  }

  self.getProduct(product.id).done(function(result) {
    if (result.data === null) {
      new Product(product).save(function(err) {
        deferred.resolve(err);
      });
    } else {
      deferred.resolve(true);
    }
  });
  return deferred.promise;
};

/**
 * Deletes the product associated with the specified ID in the database.
 *
 * @param productId       The product ID associated with the product to delete.
 * @returns {promise|*}   A promise object that indicates if an error occurred during the deletion (TRUE/FALSE).
 */
self.deleteProduct = function(productId) {
  var deferred = Q.defer();
  Product.findOne({ id: productId }).lean().exec(function(err, product) {
    if (err || !product) {
      deferred.resolve(true);
    } else {
      Product.remove({ id: productId }, function(err) {
        deferred.resolve(err);
      });
    }
  });
  return deferred.promise;
};

/**
 * Deletes all the products in the database.
 *
 * @returns {promise|*}   A promise object that indicates if an error occurred during the deletion (TRUE/FALSE).
 */
self.deleteProducts = function() {
  var deferred = Q.defer();
  Product.remove({}, function (err) {
    deferred.resolve(err);
  });
  return deferred.promise;
};

/**
 * Applies a sorting criteria to the specified products list.
 *
 * @param products          The product list to sort.
 * @param sortingCriteria   The sorting criteria to use. The available values are:
 *                            - price-asc (ascendant price);
 *                            - price-dsc (descendant price);
 *                            - alpha-asc (alphabetical order ascending);
 *                            - alpha-dsc (alphabetical order descending).
 * @returns {*}             The products list sorted.
 */
function applySortingCriteria(products, sortingCriteria) {
  if (products) {
    switch (sortingCriteria) {
      case SORTING_CRITERIA[0]:
        products = products.sort(function(a, b) {
          return a["price"] - b["price"];
        });
        break;
      case SORTING_CRITERIA[1]:
        products = products.sort(function(a, b) {
          return b["price"] - a["price"];
        });
        break;
      case SORTING_CRITERIA[2]:
        products = products.sort(function(a, b) {
          var nameA = a["name"].toLowerCase();
          var nameB = b["name"].toLowerCase();
          if (nameA > nameB) {
            return 1;
          } else if (nameA < nameB) {
            return -1;
          }
          return 0;
        });
        break;
      case SORTING_CRITERIA[3]:
        products = products.sort(function(a, b) {
          var nameA = a["name"].toLowerCase();
          var nameB = b["name"].toLowerCase();
          if (nameA > nameB) {
            return -1;
          } else if (nameA < nameB) {
            return 1;
          }
          return 0;
        });
        break;
    }
  }
  return products;
}

module.exports = self;
