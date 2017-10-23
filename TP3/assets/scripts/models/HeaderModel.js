"use strict";

var HeaderModel = function () {
  this.numberOfProducts = 0;
  this.numberOfProductsChangedEvent = new Event(this);
};

HeaderModel.prototype = {
  getNumberOfProducts : function(json) {
    return this.numberOfProducts;
  },

  setNumberOfProducts : function(numberOfProducts) {
    if(numberOfProducts) {
      this.numberOfProducts = numberOfProducts;
      this.numberOfProductsChangedEvent.notify();
    }
  }

};
