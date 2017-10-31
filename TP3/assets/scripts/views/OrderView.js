"use strict";

function OrderView(model, elements) {
  this._model = model;
  this._elements = elements;
  this.submitFormEvent = new Event(this);
  var _this = this;

  this._elements.orderForm.submit(function(e) {
    if(_this._elements.orderForm.valid()) {
      _this.submitFormEvent.notify(_this._elements.orderForm);
    	return true;
    }
    //bloque le post si formulaire invalide
    return false;
  });
};

OrderView.prototype = {
  getForm : function() {
    return $(this._elements.orderForm);
  }
};

