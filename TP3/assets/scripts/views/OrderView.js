"use strict";

function OrderView(model, elements) {
  this._model = model;
  this._elements = elements;
  this.submitFormEvent = new Event(this);
  var _this = this;

  this._elements.orderForm.submit(function(e) {
    _this.submitFormEvent.notify(_this._elements.orderForm);
    if(_this._elements.orderForm.valid()) { //TODO MOVE IN CONTROLLER IF POSSIBLE
    	return true;
    }
    return false;
  });

};

OrderView.prototype = {

};

