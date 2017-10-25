"use strict";

function OrderView(model, elements) {
  this._model = model;
  this._elements = elements;
  this.submitFormEvent = new Event(this);
  var _this = this;

  this._elements.orderForm.submit(function(e) {
    _this.submitFormEvent.notify(_this._elements.orderForm);
    if(_this._elements.orderForm.valid()) {
    	return true;
    }
    //bloque le post si formulaire invalide
    return false;
  });

};

OrderView.prototype = {

};

