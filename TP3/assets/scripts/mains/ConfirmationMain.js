"use strict";

$(function () {
  var model = new ConfirmationModel();
  var view = new ConfirmationView(model, {
      'name' : $('#name'), 
      'confirmationNumber' : $('#confirmation-number')
  });
  var controller = new ConfirmationController(model, view);
  controller.loadData();
});