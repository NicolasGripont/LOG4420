var express = require("express");
var router = express.Router();
var productsManager = require("../managers/products");

// Gets all the products in the database.
router.get("/", function(req, res) {
  productsManager.getProducts(req.query.criteria, req.query.category).done(function(result) {
    if (result.err) {
      res.status(400).send();
    } else {
      res.json(result.data);
    }
  });
});

// Gets the product associated with the specified ID.
router.get("/:id", function(req, res) {
  productsManager.getProduct(req.params.id).done(function(result) {
    if (result.err) {
      res.status(404).send();
    } else {
      res.json(result.data);
    }
  });
});

// Adds a new product in the database.
router.post("/", function(req, res) {
  productsManager.createProduct(req.body).done(function(err) {
    if (err) {
      res.status(400).send();
    } else {
      res.status(201).send();
    }
  });
});

// Deletes the product associated with the specified ID in the database.
router.delete("/:id", function(req, res) {
  productsManager.deleteProduct(req.params.id).done(function(err) {
    if (err) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  });
});

// Deletes all the products in the database.
router.delete("/", function(req, res) {
  productsManager.deleteProducts().done(function() {
    res.status(204).send();
  });
});

module.exports = router;
