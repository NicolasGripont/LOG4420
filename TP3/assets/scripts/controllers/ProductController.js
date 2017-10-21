"use strict";

function ProductController(model, view) {
  this._model = model;
  this._view = view;
  var _this = this;


  this._view.quantityChangedEvent.attach(function (sender, args) {
      _this.changeQuantity(args.quantity);
  });

  this._view.addToCartButtonClickedEvent.attach(function (sender, args) {
      _this.addToCart();
  });
}

ProductController.prototype = {
  changeQuantity : function (quantity) {
      if(quantity) {
          this._model.changeQuantity(quantity);
      }
  },
  
  addToCart : function() {
    this._model.addToCart(category);
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
        self._view.showMessageError("Page non trouvée !");
      }
    })
    .fail(function( xhr, status, errorThrown ) {
      self._view.showMessageError("Une erreur est survenue lors du chargement des produits...");
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


$(function () {
    var productJSON = undefined;
    var model = new ProductModel(productJSON),
        view = new ProductView(model, {
            'productQuantity' : $('#product-quantity'), 
            'addToCartButton' : $('.btn'), 
            'productName' : $('#product-name'),
            'productImage' : $('#product-image'),
            'productDesc' : $('#product-desc'),
            'productFeatures' : $('#product-features'),
            'productPrice' : $('#product-price'),
            'article' : $('main > article')
        }),
        controller = new ProductController(model, view);
    controller.loadData();
    view.show();

})


