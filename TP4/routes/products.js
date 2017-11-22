var express = require("express");
var router = express.Router();
var Product = require('../models/product');
var ProductsController = require('../controllers/products-controller');


/**
 * Get all products from DB
 */
router.get("/api/products", function(req, res) {
  const category = req.query.category;
  const criteria = req.query.criteria;
  const productsController = new ProductsController(res);
  productsController.findProducts(category, criteria);
});

/**
 * Get the Product from DB corresponding to the id
 */
router.get("/api/products/:id", function(req, res) {
  const id = parseInt(req.params.id);
  const productsController = new ProductsController(res);
  productsController.findProduct(id);
});

/**
 * Create a product
 */
router.post("/api/products", function(req, res) {
  var product = new Product({
    id : req.body.id,
    name : req.body.name,
    price : req.body.price,
    image : req.body.image,
    category : req.body.category,
    description : req.body.description,
    features : req.body.features
  });
  const productsController = new ProductsController(res);
  productsController.createProduct(product);
});

/**
 * Delete the Product from DB corresponding to the id
 */
router.delete("/api/products/:id", function(req, res) {
  const id = req.params.id;
  const productsController = new ProductsController(res);
  productsController.deleteProduct(id);
});

/**
 * Delete all products from DB
 */
router.delete("/api/products", function(req, res) {
  const productsController = new ProductsController(res);
  productsController.deleteProducts();
});

module.exports = router;
