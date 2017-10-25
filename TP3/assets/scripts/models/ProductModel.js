"use strict";

var ProductModel = function (json) {
  this.productJSON = json;
  this.quantity = 1;
};

ProductModel.prototype = {
  setProduct : function(json) {
    this.productJSON = json;
  },

  getProduct : function() {
    return this.productJSON;
  },

  setQuantity : function(quantity) {
    if(quantity) {
      this.quantity = quantity;
    }
  },

  getQuantity : function() {
    return this.quantity;
  }  

};
