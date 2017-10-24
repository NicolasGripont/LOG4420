"use strict";

function ShoppingCartController(model, view, messages, headerController) {
  this._model = model;
  this._view = view;
  this._messages = messages;
  this._headerController = headerController;
  var _this = this;

  if(this._view) {
    this._view.removeProductButtonClickedEvent.attach(function (sender, args) {
        _this.removeProduct(args.productId);
    });

    this._view.emptyShoppingCartButtonClickedEvent.attach(function () {
      _this.removeAllProducts();
    });
  }
}

ShoppingCartController.prototype = {
  addProduct : function (product, quantity) {
    if(product && quantity) {
      this._model.addProduct(product,quantity);
      localStorage.setItem("shoppingCart",JSON.stringify(this._model.getShoppingCart()));
      this.sortShoppingCart("name","asc");
    }
  }, 

  modifyProductQuantity : function (productId, quantity) {
    if(product && quantity) {
      // this._model.sort(criteria,orderBy);
    }
  }, 

  getNumberOfProducts : function() {
    return this._model.getNumberOfProducts();
  }, 

  loadShoppingCart : function() {
    this._model.initShoppingCart(JSON.parse(localStorage.getItem("shoppingCart")));
    if(this._view && this._model.getNumberOfProducts() === 0) {
      this._view.showMessageError(this._messages.noProductInCart);
    } 
  },

  sortShoppingCart : function(criteria, orderBy) {
    this._model.sort(criteria,orderBy);
  }, 

  removeProduct : function(productId) {
    this._model.removeProduct(productId);
    this._headerController.setNumberOfProducts(this._model.getNumberOfProducts());
    localStorage.setItem("shoppingCart",JSON.stringify(this._model.getShoppingCart()));
    if(this._view && this._model.getNumberOfProducts() === 0) {
      this._view.showMessageError(this._messages.noProductInCart);
    } 
  }, 

  removeAllProducts : function() {
    this._model.removeAllProducts();
    this._headerController.setNumberOfProducts(0);
    localStorage.removeItem("shoppingCart",JSON.stringify());
    if(this._view) {
      this._view.showMessageError(this._messages.noProductInCart);
    } 
  }
};








