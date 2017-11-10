var express = require("express");
var router = express.Router();
var validator = require('validator');

var express = require("express");
var router = express.Router();
var validator = require('validator');
var Product = require('../models/product');

router.get("/api/shopping-cart", function(req,res) {
  var products = [];
  req.session.shoppingCart.forEach(function(elem) {
    var product = {productId : elem.productId, quantity : elem.quantity};
    products.push(product);
  });
  res.status(200).json(products);
});

router.get("/api/shopping-cart/:productId", function(req, res) {
  const listProductIntoShoppingCart = req.session.shoppingCart;

  /** On fait comme ça car le .forEach() ne peut être stoppé **/
  for(var i = 0; i < listProductIntoShoppingCart.length; i++) {
    var elem = listProductIntoShoppingCart[i];
    if (elem.productId == parseInt(req.params.productId)) {
      var product = {productId : elem.productId, quantity : elem.quantity};
      return res.status(200).json(product);
    }
  }
  res.status(404).json({error : "L'identifiant spécifié n'est pas associé à un élément qui se trouve dans le panier"});
});

router.post("/api/shopping-cart", function(req, res) {
  if(req.body.productId === undefined || req.body.quantity === undefined) {
    return res.status(400).json({error: "Paramètre(s) manquant(s)."});
  }

  if(!req.session.shoppingCart) {
    req.session.shoppingCart = [];
  }

  const productIdBody = req.body.productId;
  const quantityBody = req.body.quantity;

  /** TODO : Voir comment améliorer car asynchrone avec le find **/
  checkNewProductInShoppingCart(productIdBody, quantityBody, req, res);

});

function sendResponse(productIdBody, quantityBody, req, res, error) {
  if(!error.status && !error.message) {
    req.session.shoppingCart.push({productId : productIdBody, quantity : quantityBody});
    return res.status(201).json({message : "ok"});
  }
  return res.status(error.status).json({message : error.message});
}

function checkNewProductInShoppingCart(productId, quantity, req, res) {
  var options = {};
  var errorToReturn={};
  options.id = productId;
  Product.find(options, function (err, products) {
    if (err) {
      errorToReturn.status = 500;
      errorToReturn.message = err;
    } else if (products.length != 1) {
      errorToReturn.status = 400;
      errorToReturn.message = "L'identifiant spécifié n'existe pas.";
    } else {
      errorToReturn = checkProductAndQuantity(productId, quantity, req);
    }
    sendResponse(productId, quantity, req, res, errorToReturn);
  });
}

function checkProductAndQuantity(productId, quantity, req) {
  var errorToReturn = {};
  if(isProductIntoShoppingCart(productId, req)) {
    errorToReturn.status = 400;
    errorToReturn.message = "Le produit associé à l'identifiant spécifié a déjà été ajouté dans le panier.";
  } else if (!Number.isInteger(quantity) || quantity === 0) {
    errorToReturn.status = 400;
    errorToReturn.message = "La quantité spécifiée n'est pas valide.";
  }
  return errorToReturn;
}

function isProductIntoShoppingCart(productId, req) {
  const listProductIntoShoppingCart = req.session.shoppingCart;

  /** On fait comme ça car le .forEach() ne peut être stoppé **/
  for(var i = 0; i < listProductIntoShoppingCart.length; i++) {
    var elem = listProductIntoShoppingCart[i];
    if (elem.productId === productId) {
      return true;
    }
  }
  return false;
}

module.exports = router;
