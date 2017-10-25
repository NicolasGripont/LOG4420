"use strict";

$(function () {
  var model = new HeaderModel();
  var view = new HeaderView(model, {
      'count' : $('.shopping-cart > .count')
  });
  var controller = new HeaderController(model, view);
  controller.loadNumberOfProducs();
  view.show();
});