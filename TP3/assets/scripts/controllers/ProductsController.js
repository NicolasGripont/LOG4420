"use strict";

function ProductsController(model, view, messages) {
  this._model = model;
  this._view = view;
  this._messages = messages;
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
      self._view.showMessageError(self._messages.anErrorOccured);
    });
  }
};
