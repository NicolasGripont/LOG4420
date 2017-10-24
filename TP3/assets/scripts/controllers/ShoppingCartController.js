"use strict";

function ShoppingCartController(model, view, messages) {
  this._model = model;
  this._view = view;
  this._messages = messages;
  var _this = this;

  // this._view.criteriaButtonClickedEvent.attach(function (sender, args) {
  //     _this.sortProducts(args.criteria, args.orderBy);
  // });

  // this._view.categoryButtonClickedEvent.attach(function (sender, args) {
  //     _this.filterProducts(args.category);
  // });
}

ShoppingCartController.prototype = {
  addProduct : function (product, quantity) {
    if(product && quantity) {
      this._model.addProduct(product,quantity);
      localStorage.setItem("shoppingCart",JSON.stringify(this._model.getShoppingCart()));
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
    
  }
};
