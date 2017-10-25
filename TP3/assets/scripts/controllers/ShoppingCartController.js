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

    this._view.quantityProductButtonClickedEvent.attach(function (sender, args) {
      _this.changeProductQuantity(args.productId, args.deltaQuantity);
    });
  }
}

ShoppingCartController.prototype = {
  addProduct : function (product, quantity) {
    if(product && quantity) {
      this._model.addProduct(product,quantity);
      this.sortShoppingCart("name","asc");
      localStorage.setItem("shoppingCart",JSON.stringify(this._model.getShoppingCart()));
    }
  }, 

  getNumberOfProducts : function() {
    return this._model.getNumberOfProducts();
  }, 

  loadShoppingCart : function() {
    this._model.initShoppingCart(JSON.parse(localStorage.getItem("shoppingCart")));
    if(this._view) {
      if(this._model.getNumberOfProducts() === 0 ) {
        this._view.showMessageError(this._messages.noProductInCart);
      } else {
        this._view.rebuildShoppingCart();
      }
    } 
  },

  sortShoppingCart : function(criteria, orderBy) {
    this._model.sort(criteria,orderBy);
  }, 

  removeProduct : function(productId) {
    if(this._view) {
      if(this._view.showModalConfirmMessage(this._messages.askToRemoveProduct)) {
        this._model.removeProduct(productId);
        localStorage.setItem("shoppingCart",JSON.stringify(this._model.getShoppingCart()));
        if(this._model.getNumberOfProducts() === 0) {
          this._view.showMessageError(this._messages.noProductInCart);
        } else {
          this._view.productRemoved(productId);
        }
      } 
    } else {
      this._model.removeProduct(productId);
      localStorage.setItem("shoppingCart",JSON.stringify(this._model.getShoppingCart()));
    }
    if(this._headerController) {
      this._headerController.setNumberOfProducts(this._model.getNumberOfProducts());
    }
  }, 

  removeAllProducts : function() {
    if(this._view) {
      if(this._view.showModalConfirmMessage(this._messages.askToEmptyShoppingCart)) {
        this._model.removeAllProducts();
        localStorage.removeItem("shoppingCart",JSON.stringify());
        this._view.showMessageError(this._messages.noProductInCart);
      }
    } else {
      this._model.removeAllProducts();
      
      localStorage.removeItem("shoppingCart",JSON.stringify());
    }
    if(this._headerController) {
      this._headerController.setNumberOfProducts(0);
    }
  },

  changeProductQuantity : function(productId, deltaQuantity) {
    this._model.changeProductQuantity(productId, deltaQuantity);
    localStorage.setItem("shoppingCart",JSON.stringify(this._model.getShoppingCart()));
    if(this._headerController) {
      this._headerController.setNumberOfProducts(this._model.getNumberOfProducts());
    }
    if(this._view) {
      this._view.quantityChanged(productId);
    }
    
  }

};








