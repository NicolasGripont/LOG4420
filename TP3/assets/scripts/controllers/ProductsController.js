"use strict";

function ProductsController(model, view) {
  this._model = model;
  this._view = view;
  var _this = this;


  this._view.criteriaButtonClickedEvent.attach(function (sender, args) {
      _this.sortProducts(args.criteria, args.orderBy);
  });

  this._view.categoryButtonClickedEvent.attach(function (sender, args) {
      _this.filterProducts(args.category);
  });
}

ProductsController.prototype = {
  sortProducts : function (criteria, orderBy) {
      if(criteria && orderBy) {
          this._model.sort(criteria,orderBy);
      }
  },
  
  filterProducts : function (category) {
      if(category) {
          this._model.filter(category);
      }
  }, 

  loadData : function () {
    var self = this;
    $.ajax({
      url: "./data/products.json",
      type: "GET",
      dataType : "json"
    })
    .done(function(json) {
      self._model.resetProducts(json);
      localStorage.setItem("products-list",JSON.stringify(json));
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
    var productsJSON = undefined;//JSON.parse('[{"id": 1,"name": "Apple TV","price": 249.99,"image": "apple-tv.png","category": "computers"},{"id": 2,"name": "Canon EOS 5D Mark II","price": 2999.99,"image": "camera-1.png","category": "cameras"}]');
    var model = new ProductsModel(productsJSON),
        view = new ProductsView(model, {
            'productsList' : $('#products-list'), 
            'categoriesButtonsGroups' : $('#product-categories'), 
            'criteriaButtonsGroups' : $('#product-criteria'),
            'productsCount' : $('#products-count'),
        }),
        controller = new ProductsController(model, view);
    controller.loadData();
    view.show();

})



