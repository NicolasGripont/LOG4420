$(function () {
  var model = new ProductsModel();
  var view = new ProductsView(model, {
    'productsList' : $('#products-list'), 
    'categoriesButtonsGroups' : $('#product-categories'), 
    'criteriaButtonsGroups' : $('#product-criteria'),
    'productsCount' : $('#products-count'),
    'main' : $("main"),
    'dialog' : $("#dialog")
  });
  var controller = new ProductsController(model, view, new Messages());
  controller.loadData();
  view.show();
})