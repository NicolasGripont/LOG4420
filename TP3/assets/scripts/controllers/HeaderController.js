"use strict";

function HeaderController(model, view) {
  this._model = model;
  this._view = view;
};

HeaderController.prototype = {
  loadNumberOfProducs : function() {
    var numberOfProducts = localStorage.getItem("numberOfProducts");
    if(numberOfProducts) {
      this._model.setNumberOfProducts(numberOfProducts);
      if(this._view) {
        this._view.rebuildHeader();
      }
    }
  }, 

  setNumberOfProducts : function(numberOfProducts) {
    localStorage.setItem("numberOfProducts", numberOfProducts);
    if(numberOfProducts) {
      this._model.setNumberOfProducts(numberOfProducts);
    } else {
      this._model.setNumberOfProducts(0);
    }
    if(this._view) {
      this._view.rebuildHeader();
    }
  }
};




