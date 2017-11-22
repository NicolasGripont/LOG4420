var express = require("express");
var router = express.Router();
var Order = require('../models/order');
var OrderController = require('../controllers/order-controller');

/**
 * Get all orders from DB
 */
router.get("/api/orders", function(req, res) {
  const orderController = new OrderController(req, res);
  orderController.findOrders();
});

/**
 * Get order from DB corresponding to the id
 */
router.get("/api/orders/:id", function(req, res) {
  const id = req.params.id;
  const orderController = new OrderController(req, res);
  orderController.findOrder(id);
});

/**
 * Create an order in DB
 */
router.post("/api/orders", function(req, res) {
  const order = new Order({
    id : req.body.id,
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    email : req.body.email,
    phone : req.body.phone,
    products : req.body.products
  });

  const orderController = new OrderController(req, res);
  orderController.createOrder(order);
});

/**
 * Delete the order form DB corresponding to the id
 */
router.delete("/api/orders/:id", function(req, res) {
  const id = req.params.id;
  const orderController = new OrderController(req, res);
  orderController.deleteOrder(id);
});

/**
 * Delete all orders from DB
 */
router.delete("/api/orders", function(req, res) {
  const orderController = new OrderController(req, res);
  orderController.deleteOrders();
});

/**
 * Get new order ID available
 */
router.get("/api/orders/ids/newIdAvailable", function(req, res) {
  const orderController = new OrderController(req, res);
  orderController.getNewIdAvailable();
});


module.exports = router;
