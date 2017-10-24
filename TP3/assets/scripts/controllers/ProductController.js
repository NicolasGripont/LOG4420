"use strict";

function ProductController(model, view, messages, headerController, shoppingCartController) {
  this._model = model;
  this._view = view;
  this._messages = messages;
  this._headerController = headerController;
  this._shoppingCartController = shoppingCartController;
  var _this = this;

  this._view.quantityChangedEvent.attach(function (sender, args) {
      _this.setQuantity(args.quantity);
  });

  this._view.addToCartButtonClickedEvent.attach(function (sender, args) {
      _this.addToCart();
  });
}

ProductController.prototype = {
  setQuantity : function (quantity) {
      if(quantity) {
        this._model.setQuantity(quantity);
      }
  },
  
  addToCart : function() {
    var product = this._model.getProduct();
    var quantity = this._model.getQuantity();
    this._shoppingCartController.addProduct(product, quantity);
    this._headerController.setNumberOfProducts(this._shoppingCartController.getNumberOfProducts());
    this._model.setQuantity(1);
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
      if(product === undefined) { 
        self._view.showMessageError(self._messages.pageNotFound);
      }
    })
    .fail(function( xhr, status, errorThrown ) {
      self._view.showMessageError(self._messages.anErrorOccured);
    });
  }, 

  getUrlParameter : function(sParam) {
      var sPageURL = decodeURIComponent(window.location.search.substring(1)),
          sURLVariables = sPageURL.split('&'),
          sParameterName,
          i;

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

/* MAIN */





