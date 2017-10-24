$(function () {
  var model = new ShoppingCartModel();
  var view = new ShoppingCartView(model, {
    // 'productsList' : $('#products-list'), 
    // 'categoriesButtonsGroups' : $('#product-categories'), 
    // 'criteriaButtonsGroups' : $('#product-criteria'),
    // 'productsCount' : $('#products-count'),
    // 'main' : $("main")
  });
  var controller = new ShoppingCartController(model, view, new Messages());
  controller.loadData();
  view.show();
})