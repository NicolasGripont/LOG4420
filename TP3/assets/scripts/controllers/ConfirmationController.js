"use strict";

function ConfirmationController(model, view) {
  this._model = model;
  this._view = view;
};

ConfirmationController.prototype = {
  loadData : function () {
    this._model.setClientFirstName(localStorage.getItem("firstName"));
    this._model.setClientLastName(localStorage.getItem("lastName"));
    this._model.setCommandId(localStorage.getItem("numberOfCommandDone"));
    this._view.rebuildConfirmation();
  },

  determineLastCommandId : function() {
    if(localStorage.getItem("numberOfCommandDone")) {
      return localStorage.getItem("numberOfCommandDone")
    }
    return 0;
  }
};
