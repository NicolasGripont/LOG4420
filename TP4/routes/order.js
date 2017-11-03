var express = require("express");
var router = express.Router();

router.get("/commande", function(req, res) {
  res.render("order", { title: "OnlineShop - Commande", activeLi: "Panier"});
});

router.get("/confirmation", function(req, res) {
  res.render("confirmation", { title: "OnlineShop - Confirmation", activeLi: "Panier"});
});

module.exports = router;
