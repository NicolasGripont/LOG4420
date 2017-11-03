var express = require("express");
var router = express.Router();

router.get("/produits", function(req, res) {
  res.render("products", { title: "OnlineShop - Produits", activeLi: "Produits"});
});

router.get("/produit", function(req, res) {
  res.render("product", { title: "OnlineShop - Produit", activeLi: "Produits"});
});


module.exports = router;
