"use strict";

function ProductController(model, view, messages, headerController, shoppingCartController) {
  this._model = model;
  this._view = view;
  this._messages = messages;
  this._headerController = headerController;
  this._shoppingCartController = shoppingCartController;
  var _this = this;

  if(this._view) {
    this._view.addToCartButtonClickedEvent.attach(function (sender, args) {
      _this.addToCart(args.product, args.quantity);
    });
  }
};

ProductController.prototype = {
  addToCart : function(product, quantity) {    
    this._shoppingCartController.addProduct(product, quantity);
    console.log(this._shoppingCartController.getNumberOfProducts());
    this._headerController.setNumberOfProducts(this._shoppingCartController.getNumberOfProducts());

    if(this._view) {
      this._view.showDialogMessage(this._messages.productAdded);
      this._view.updateQuantity(1);
    }
  }, 

  loadData : function() {
    var self = this;
    $.ajax({
      url: "./data/products.json",
      type: "GET",
      dataType : "json"
    })
    .done(function(json) {
      const id = self.getUrlParameter("id");
      const product = self.getProductById(id,json);
      self._model.setProduct(product);
      if(self._view) {
        if(product) { 
          self._view.rebuildProduct();
        } else {
          self._view.showMessageError(self._messages.pageNotFound);
        }
      }
    })
    .fail(function( xhr, status, errorThrown ) {
      if(self._view) {
        self._view.showMessageError(self._messages.anErrorOccured);
      }
    });
  }, 

  getUrlParameter : function(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1));
    var sURLVariables = sPageURL.split('&');
    var sParameterName;
    var i;
    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  }, 

  getProductById : function(id, json) {
    for(var i = 0; i < json.length; i++) {
      if(json[i].id == id) {
        return json[i];
      }
    }
    return undefined;
  }

};


