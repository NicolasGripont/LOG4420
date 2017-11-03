var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
  res.render("index", { title: "OnlineShop - Accueil", activeLi: "Accueil"});
});

router.get("/accueil", function(req, res) {
  res.render("index", { title: "OnlineShop - Accueil", activeLi: "Accueil"});
});

router.get("/contact", function(req, res) {
  res.render("contact", { title: "OnlineShop - Contact", activeLi: "Contact"});
});

module.exports = router;
