var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
  res.render("index", { title: "Accueil", message: "Ça semble fonctionner!" });
});

module.exports = router;
