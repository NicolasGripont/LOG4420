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
  shoppingCartController.loadShoppingCart();

  var productJSON = undefined;
  var model = new ProductModel(productJSON);
  var view = new ProductView(model, {
      'productQuantity' : $('#product-quantity'), 
      'addToCartButton' : $('.btn'), 
      'productName' : $('#product-name'),
      'productImage' : $('#product-image'),
      'productDesc' : $('#product-desc'),
      'productFeatures' : $('#product-features'),
      'productPrice' : $('#product-price'),
      'article' : $('article')
  });
  var controller = new ProductController(model, view, new Messages, headerController, shoppingCartController);
  controller.loadData();
  view.show();
})