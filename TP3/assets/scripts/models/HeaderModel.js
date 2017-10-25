"use strict";

var HeaderModel = function () {
  this.numberOfProducts = 0;
};

HeaderModel.prototype = {
  getNumberOfProducts : function(json) {
    return this.numberOfProducts;
  },

  setNumberOfProducts : function(numberOfProducts) {
    this.numberOfProducts = numberOfProducts;
  }

};
