$(function () {
  var headerModel = new HeaderModel();
  var headerView = new HeaderView(headerModel, {
      'count' : $('.shopping-cart > .count')
  });
  var headerController = new HeaderController(headerModel, headerView);
  headerController.loadNumberOfProducs();
  headerView.show();

  var shoppingCartModel = new ShoppingCartModel();
  var shoppingCartController = new ShoppingCartController(shoppingCartModel);

  var firstName = undefined;
  var lastName = undefined;
  var commandId = undefined;
  
  var model = new OrderModel(firstName,lastName,commandId);
  var view = new OrderView(model, {
      'buttonSubmitForm' : $('.btn'), 
      'orderForm' : $('#order-form')
  });
  var controller = new OrderController(model, view, new Messages, headerController, shoppingCartController);
  /*controller.loadData();
  view.show();*/
})