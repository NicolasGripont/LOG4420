var express = require("express");
var router = express.Router();
var validator = require('validator');

var express = require("express");
var router = express.Router();
var validator = require('validator');
var Product = require('../models/product');

router.get("/api/shopping-cart", function(req,res) {
  var products = [];

  if(!req.session.shoppingCart) {
    req.session.shoppingCart = [];
  }
  req.session.shoppingCart.forEach(function(elem) {
    var product = { productId : elem.productId, quantity : elem.quantity };
    products.push(product);
  });

  return res.status(200).json(products);
});

router.get("/api/shopping-cart/:productId", function(req, res) {
  if(!req.session.shoppingCart) {
    req.session.shoppingCart = [];
  }

  const shoppingCart = req.session.shoppingCart;
  //TODO check param
  const productId = parseInt(req.params.productId);

  var product = getProductFromShoppingCart(shoppingCart, productId);
  if(product.productId) {
    return res.status(200).json(product);
  }
  return res.status(404).json({error : "L'identifiant spécifié n'est pas associé à un élément qui se trouve dans le panier"});
});

router.post("/api/shopping-cart", function(req, res) {
  const productIdBody = parseInt(req.body.productId);
  const quantityBody = parseInt(req.body.quantity);

  if(!productIdBody || !quantityBody) {
    return res.status(400).json({error: "Paramètre(s) manquant(s) ou invalide(s)."});
  }

  if(!req.session.shoppingCart) {
    req.session.shoppingCart = [];
  }

  addNewProductInShoppingCart(req.session.shoppingCart, productIdBody, quantityBody, res);
});

router.put("/api/shopping-cart/:productId", function(req, res) {
  if(req.body.quantity === undefined) {
    return res.status(400).json({error: "Quantité requise."});
  }

  const quantityBody = parseInt(req.body.quantity);
  const productIdParam = req.params.productId;
  var shoppingCart = req.session.shoppingCart;

  var product = getProductFromShoppingCart(shoppingCart, productIdParam);
  var error = {};

  if(!product.productId) {
    error.status = 404;
    error.message = "Le produit n'existe pas dans le panier.";
  } else if (!isGoodQuantity(quantityBody)) {
    error.status = 400;
    error.message = "La quantité spécifiée est invalide.";
  }

  if(error.status) {
    res.status(error.status).json({message : error.message});
  } else {
    product.quantity = quantityBody;
    res.status(204).send();
  }
});

router.delete("/api/shopping-cart/:productId", function(req, res) {
  const productIdParam = req.params.productId;
  var shoppingCart = req.session.shoppingCart;
  removeProduct(shoppingCart, productIdParam, res);
});

router.delete("/api/shopping-cart", function(req, res) {
  req.session.shoppingCart = [];
  return res.status(204).send();
});

function getProductFromShoppingCart(shoppingCart, productId) {
  for(var i = 0; i < shoppingCart.length; i++) {
    var elem = shoppingCart[i];
    if (elem.productId == productId) {
      return elem;
    }
  }
  return {};
}

function removeProduct(listProducts, productId, res) {
  for(var i = 0; i < listProducts.length; i++) {
    var elem = listProducts[i];
    if (elem.productId == parseInt(productId)) {
      listProducts.splice(i,1);
      return res.status(204).send();
    }
  }
  return res.status(404).json({message : "Le produit n'existe pas dans le panier."});
}

function addNewProductInShoppingCart(shoppingCart, productId, quantity, res) {
  var options = {};
  var error = {};
  options.id = productId;
  Product.find(options, function (err, products) {
    if (err) {
      error.status = 500;
      error.message = err;
    } else if (products.length != 1) {
      error.status = 400;
      error.message = "L'identifiant spécifié n'existe pas.";
    } else {
      const product = getProductFromShoppingCart(shoppingCart, productId);
      if(product.productId) {
        error.status = 400;
        error.message = "Le produit associé à l'identifiant spécifié a déjà été ajouté dans le panier.";
      } else if (!isGoodQuantity(quantity)) {
        error.status = 400;
        error.message = "La quantité spécifiée n'est pas valide.";
      }
      error = checkProductAndQuantity(shoppingCart, productId, quantity);
    }
    if(!error.status && !error.message) {
      shoppingCart.push({productId : productId, quantity : quantity});
      return res.status(201).json({message : "OK"});
    }
    return res.status(error.status).json({message : error.message});
  });
}

function isGoodQuantity(quantity) {
  var test = Number.isInteger(quantity) && quantity > 0;
  return test;
}

function checkProductAndQuantity(shoppingCart, productId, quantity) {
  var errorToReturn = {};
  /** TODO : mettre get ... à la place **/
  if(isProductInShoppingCart(shoppingCart, productId)) {
    errorToReturn.status = 400;
    errorToReturn.message = "Le produit associé à l'identifiant spécifié a déjà été ajouté dans le panier.";
  } else if (!isGoodQuantity(quantity)) {
    errorToReturn.status = 400;
    errorToReturn.message = "La quantité spécifiée n'est pas valide.";
  }
  return errorToReturn;
}

function isProductInShoppingCart(shoppingCart, productId) {
  for(var i = 0; i < shoppingCart.length; i++) {
    var elem = shoppingCart[i];
    if (elem.productId === productId) {
      return true;
    }
  }

  return false;
}

module.exports = router;
