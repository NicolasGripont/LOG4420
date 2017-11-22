var express = require("express");
var router = express.Router();

/**
 * Get Home View
 */
router.get("/", function(req, res) {
  res.render("index", { title: "OnlineShop - Accueil", activeLi: "Accueil"});
});

/**
 * Get Home View
 */
router.get("/accueil", function(req, res) {
  res.render("index", { title: "OnlineShop - Accueil", activeLi: "Accueil"});
});

/**
 * Get Products View
 */
router.get("/produits", function(req, res) {
  res.render("products", { title: "OnlineShop - Produits", activeLi: "Produits"});
});

/**
 * Get Product View
 */
router.get("/produit", function(req, res) {
  res.render("product", { title: "OnlineShop - Produit", activeLi: "Produits"});
});

/**
 * Get Shopping Cart View
 */
router.get("/panier", function(req, res) {
  res.render("shopping-cart", { title: "OnlineShop - Panier", activeLi: "Panier"});
});

/**
 * Get Order View
 */
router.get("/commande", function(req, res) {
  res.render("order", { title: "OnlineShop - Commande", activeLi: "Panier"});
});

/**
 * Get Confirmation View
 */
router.get("/confirmation", function(req, res) {
  res.render("confirmation", { title: "OnlineShop - Confirmation", activeLi: "Panier"});
});

/**
 * Get Contact View
 */
router.get("/contact", function(req, res) {
  res.render("contact", { title: "OnlineShop - Contact", activeLi: "Contact"});
});


module.exports = router;
