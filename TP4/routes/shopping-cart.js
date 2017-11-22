var express = require("express");
var router = express.Router();
var ShoppingCartController = require('../controllers/shopping-cart-controller');


/**
 * Get all ProductId-Quantity from shopping cart
 */
router.get("/api/shopping-cart", function(req,res) {
  const shoppingCartController = new ShoppingCartController(req, res);
  shoppingCartController.findProducts();
});

/**
 * Get ProductId-Quantity from shopping cart corresponding to productId
 */
router.get("/api/shopping-cart/:productId", function(req, res) {
  const productId = parseInt(req.params.productId);
  const shoppingCartController = new ShoppingCartController(req, res);
  shoppingCartController.findProduct(productId);
});

/**
 * Add new ProductId-Quantity in the shopping cart
 */
router.post("/api/shopping-cart", function(req, res) {
  const productIdBody = parseInt(req.body.productId);
  const quantityBody = parseInt(req.body.quantity);
  const shoppingCartController = new ShoppingCartController(req, res);
  shoppingCartController.addNewProduct(productIdBody, quantityBody);
});

/**
 * Update ProductId-Quantity in the shopping cart corresponding to productId
 */
router.put("/api/shopping-cart/:productId", function(req, res) {
  const quantityBody = parseInt(req.body.quantity);
  const productIdParam = req.params.productId;
  const shoppingCartController = new ShoppingCartController(req, res);
  shoppingCartController.updateQuantity(productIdParam, quantityBody);

});


/**
 * Delete ProductId-Quantity from shopping cart corresponding to productId
 */
router.delete("/api/shopping-cart/:productId", function(req, res) {
  const productIdParam = req.params.productId;
  const shoppingCartController = new ShoppingCartController(req, res);
  shoppingCartController.removeProduct(productIdParam);

});

/**
 * Delete all ProductId-Quantity from shopping cart
 */
router.delete("/api/shopping-cart", function(req, res) {
  const shoppingCartController = new ShoppingCartController(req, res);
  shoppingCartController.removeProducts();
});

module.exports = router;
