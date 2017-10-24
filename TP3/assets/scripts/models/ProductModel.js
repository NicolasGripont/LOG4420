"use strict";

var ProductModel = function (json) {
  this.productJSON = json;
  this.quantityChangedEvent = new Event(this);
  this.productChangedEvent = new Event(this);
  this.quantity = 1;
};

ProductModel.prototype = {
  setProduct : function(json) {
    this.productJSON = json;
    this.productChangedEvent.notify();
  },

  getProduct : function() {
    return this.productJSON;
  },

  setQuantity : function(quantity) {
    if(quantity) {
      this.quantity = quantity;
      this.quantityChangedEvent.notify();
    }
  },

  getQuantity : function() {
    return this.quantity;
  }  

};
