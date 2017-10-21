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
  
  addToCart : function () {
    this._model.addToCart(category);
  }, 

  loadData : function () {
    var self = this;
    $.ajax({
      url: "./data/products.json",
      type: "GET",
      dataType : "json"
    })
    .done(function(json) {
      self._model.setProduct(json[1]);
    })
    .fail(function( xhr, status, errorThrown ) {
      console.log( "Error: " + errorThrown );
      console.log( "Status: " + status );
      console.dir( xhr );
      localStorage.setItem("products-list","");
      self._view.showError();
    });
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
        }),
        controller = new ProductController(model, view);
    controller.loadData();
    view.show();

})


