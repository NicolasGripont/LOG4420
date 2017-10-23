$(function () {
	var headerModel = new HeaderModel();
  var headerView = new HeaderView(headerModel, {
      'count' : $('.shopping-cart > .count')
  });
  var headerController = new HeaderController(headerModel, headerView);
  headerController.loadNumberOfProducs();
  headerView.show();

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
      'article' : $('main > article')
  });
  var controller = new ProductController(model, view, new Messages, headerController);
  controller.loadData();
  view.show();
})