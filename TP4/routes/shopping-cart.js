var express = require("express");
var router = express.Router();
var ShoppingCartController = require('../controllers/shopping-cart-controller');

router.get("/api/shopping-cart", function(req,res) {
  const shoppingCartController = new ShoppingCartController(req, res);
  shoppingCartController.findProducts();
});

router.get("/api/shopping-cart/:productId", function(req, res) {
  const productId = parseInt(req.params.productId);
  const shoppingCartController = new ShoppingCartController(req, res);
  shoppingCartController.findProduct(productId);
});

router.post("/api/shopping-cart", function(req, res) {
  const productIdBody = parseInt(req.body.productId);
  const quantityBody = parseInt(req.body.quantity);
  const shoppingCartController = new ShoppingCartController(req, res);
  shoppingCartController.addNewProduct(productIdBody, quantityBody);
});

router.put("/api/shopping-cart/:productId", function(req, res) {
  const quantityBody = parseInt(req.body.quantity);
  const productIdParam = req.params.productId;
  const shoppingCartController = new ShoppingCartController(req, res);
  shoppingCartController.updateQuantity(productIdParam, quantityBody);

});

router.delete("/api/shopping-cart/:productId", function(req, res) {
  const productIdParam = req.params.productId;
  const shoppingCartController = new ShoppingCartController(req, res);
  shoppingCartController.removeProduct(productIdParam);

});

router.delete("/api/shopping-cart", function(req, res) {
  const shoppingCartController = new ShoppingCartController(req, res);
  shoppingCartController.removeProducts();
});

module.exports = router;
