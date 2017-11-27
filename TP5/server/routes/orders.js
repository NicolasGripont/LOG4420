var express = require("express");
var router = express.Router();
var ordersManager = require("../managers/orders");

// Gets all the orders in the database.
router.get("/", function(req, res) {
  ordersManager.getOrders().done(function(result) {
    res.json(result.data);
  });
});

// Gets the order associated with the specified ID.
router.get("/:id", function(req, res) {
  ordersManager.getOrder(req.params.id).done(function(result) {
    if (result.err) {
      res.status(404).send();
    } else {
      res.json(result.data);
    }
  });
});

// Adds a new order in the database.
router.post("/", function(req, res) {
  ordersManager.createOrder(req.body).done(function(err) {
    if (err) {
      res.status(400).send();
    } else {
      res.status(201).send();
    }
  });
});

// Deletes the order associated with the specified ID in the database.
router.delete("/:id", function(req, res) {
  ordersManager.deleteOrder(req.params.id).done(function(err) {
    if (err) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  })
});

// Deletes all the orders in the database.
router.delete("/", function(req, res) {
  ordersManager.deleteOrders().done(function() {
    res.status(204).send();
  })
});

module.exports = router;
