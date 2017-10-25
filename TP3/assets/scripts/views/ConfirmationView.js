"use strict";

function ConfirmationView(model, elements) {
  this._model = model;
  this._elements = elements;
};

ConfirmationView.prototype = {
  show : function () {
      this.rebuildConfirmation();
  },

  rebuildConfirmation : function () {
    this._elements.name.html(this._model.getClientFirstName() + " " + this._model.getClientLastName());
    this._elements.confirmationNumber.html(this._model.getCommandId());
  }
};


