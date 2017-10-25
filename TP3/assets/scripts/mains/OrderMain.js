"use strict";

$(function () {
  var headerModel = new HeaderModel();
  var headerView = new HeaderView(headerModel, {
      'count' : $('.shopping-cart > .count')
  });
  var headerController = new HeaderController(headerModel, headerView);
  headerController.loadNumberOfProducs();
  headerView.show();

  var shoppingCartModel = new ShoppingCartModel();
  var shoppingCartController = new ShoppingCartController(shoppingCartModel, undefined, undefined, headerController);
  
  var model = new OrderModel();
  var view = new OrderView(model, {
      'buttonSubmitForm' : $('.btn'), 
      'orderForm' : $('#order-form'),
      'firstName' : $('#first-name'),
      'lastName' : $('#last-name')
  });
  var controller = new OrderController(model, view, new Messages, headerController, shoppingCartController);
  /*controller.loadData();
  view.show();*/
});