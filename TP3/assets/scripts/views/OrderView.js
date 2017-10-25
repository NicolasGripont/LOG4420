"use strict";

function OrderView(model, elements) {
  this._model = model;
  this._elements = elements;
  this.submitFormEvent = new Event(this);
  var _this = this;

  this._elements.buttonSubmitForm.click(function(e) {
    _this.submitFormEvent.notify(_this._elements.orderForm);
  });

};

OrderView.prototype = {

};

