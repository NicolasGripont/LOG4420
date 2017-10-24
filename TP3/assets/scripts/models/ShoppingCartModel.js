"use strict";

var ShoppingCartModel = function () {
  this.shoppingCart = {};
  this.numberOfProducts = 0;
  this.numberOfProductsChangedEvent = new Event(this);
};

ShoppingCartModel.prototype = {
  getShoppingCart : function() {
    return this.shoppingCart;
  }, 

  addProduct : function (product, quantity) {
    if(product && quantity) {
      if(this.shoppingCart[product.id]) {
          this.shoppingCart[product.id]["quantity"] += quantity;
      } else {
        this.shoppingCart[product.id] = {};
        this.shoppingCart[product.id]["product"] = product;
        this.shoppingCart[product.id]["quantity"] = quantity;
      }
      this.numberOfProducts += quantity;
    }
  }, 

  getNumberOfProducts : function() {
    return this.numberOfProducts;
  },

  initShoppingCart : function(json) {
    this.numberOfProducts = 0;
    var self = this;
    if(json) {
      this.shoppingCart = json;
      $.each(this.shoppingCart, function(i, item) {
        self.numberOfProducts += item["quantity"];
      })
    } else {
      this.shoppingCart = {};
    }
  }
};
