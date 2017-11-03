var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
  res.render("index", { title: "OnlineShop - Accueil", activeLi: "Accueil"});
});

router.get("/accueil", function(req, res) {
  res.render("index", { title: "OnlineShop - Accueil", activeLi: "Accueil"});
});

router.get("/produits", function(req, res) {
  res.render("products", { title: "OnlineShop - Produits", activeLi: "Produits"});
});

router.get("/produit", function(req, res) {
  res.render("product", { title: "OnlineShop - Produit", activeLi: "Produits"});
});

router.get("/contact", function(req, res) {
  res.render("contact", { title: "OnlineShop - Contact", activeLi: "Contact"});
});
router.get("/panier", function(req, res) {
  res.render("shopping-cart", { title: "OnlineShop - Panier", activeLi: "Panier"});
});

router.get("/commande", function(req, res) {
  res.render("order", { title: "OnlineShop - Commande", activeLi: "Panier"});
});
router.get("/confirmation", function(req, res) {
  res.render("confirmation", { title: "OnlineShop - Confirmation", activeLi: "Panier"});
});



module.exports = router;
