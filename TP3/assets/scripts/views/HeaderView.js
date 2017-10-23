"use strict";

function HeaderView(model, elements) {
  this._model = model;
  this._elements = elements;

  var _this = this;

  // attach model listeners
  this._model.numberOfProductsChangedEvent.attach(function () {
    _this.rebuildHeader();
  });
}

HeaderView.prototype = {
  show : function () {
      this.rebuildHeader();
  },

  rebuildHeader : function () {
    var _this = this
    var numberOfProducts = this._model.getNumberOfProducts();
    $(this._elements.count).html(numberOfProducts);
    if(numberOfProducts == 0) {
      $(this._elements.count).hide();
    } else {
      $(this._elements.count).show();
    }
  }
};


