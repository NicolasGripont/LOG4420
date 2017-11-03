var express = require("express");
var router = express.Router();

router.get("/panier", function(req, res) {
  res.render("shopping-cart", { title: "OnlineShop - Panier", activeLi: "Panier"});
});

module.exports = router;
