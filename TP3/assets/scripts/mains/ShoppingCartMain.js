"use strict";

$(function () {
  var headerModel = new HeaderModel();
  var headerView = new HeaderView(headerModel, {
      'count' : $('.shopping-cart > .count')
  });
  var headerController = new HeaderController(headerModel, headerView);
  headerController.loadNumberOfProducs();
  headerView.show();

  var model = new ShoppingCartModel();
  var view = new ShoppingCartView(model, {
    'tbody' : $('.shopping-cart-table tbody'),
    'total' : $('#total-amount'),
    'main' : $('main'),
    'emptyShoppingCartButton' : $('#remove-all-items-button')
  });
  var controller = new ShoppingCartController(model, view, new Messages(), headerController);
  controller.loadShoppingCart();

});