var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
  res.render("index", { title: "Accueil", message: "Ça semble fonctionner!" });
});

router.get("/accueil", function(req, res) {
  res.render("index", { title: "Accueil", message: "Ça semble fonctionner!" });
});

router.get("/produits", function(req, res) {
  res.render("products", { title: "Accueil", message: "Ça semble fonctionner!" });
});

router.get("/produit", function(req, res) {
  res.render("product", { title: "Accueil", message: "Ça semble fonctionner!" });
});

router.get("/contact", function(req, res) {
  res.render("contact", { title: "Accueil", message: "Ça semble fonctionner!" });
});
router.get("/panier", function(req, res) {
  res.render("shopping-cart", { title: "Accueil", message: "Ça semble fonctionner!" });
});

router.get("/commande", function(req, res) {
  res.render("order", { title: "Accueil", message: "Ça semble fonctionner!" });
});
router.get("/confirmation", function(req, res) {
  res.render("confirmation", { title: "Accueil", message: "Ça semble fonctionner!" });
});



module.exports = router;
