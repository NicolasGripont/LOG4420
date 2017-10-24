$(function () {
  var headerModel = new HeaderModel();
  var headerView = new HeaderView(headerModel, {
      'count' : $('.shopping-cart > .count')
  });
  var headerController = new HeaderController(headerModel, headerView);
  headerController.loadNumberOfProducs();
  headerView.show();

  var orderJSON = undefined;
  
  var model = new OrderModel(orderJSON);
  var view = new OrderView(model, {
      'buttonSubmitForm' : $('.btn'), 
      'orderForm' : $('#order-form')
  });
  var controller = new OrderController(model, view, new Messages, headerController);
  /*controller.loadData();
  view.show();*/
})