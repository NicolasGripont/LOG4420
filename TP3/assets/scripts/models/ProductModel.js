"use strict";

var ProductModel = function (json) {
  this.productJSON = json;
};

ProductModel.prototype = {
  setProduct : function(json) {
    this.productJSON = json;
  },

  getProduct : function() {
    return this.productJSON;
  }
};
