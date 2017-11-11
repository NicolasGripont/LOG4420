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
    var product = {productId : elem.productId, quantity : elem.quantity};
    products.push(product);
  });
  return res.status(200).json(products);
});

router.get("/api/shopping-cart/:productId", function(req, res) {
  if(!req.session.shoppingCart) {
    req.session.shoppingCart = [];
  }
  const listProductsIntoShoppingCart = req.session.shoppingCart;
  const productId = req.params.productId;

  var product = getProductIntoShoppingCart(listProductsIntoShoppingCart, productId);
  if(product.productId) {
    return res.status(200).json(product);
  }
  return res.status(404).json({error : "L'identifiant spécifié n'est pas associé à un élément qui se trouve dans le panier"});
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

  // TODO : Voir comment améliorer car asynchrone avec le find
  checkNewProductInShoppingCart(productIdBody, quantityBody, req, res);
});

router.put("/api/shopping-cart/:productId", function(req, res) {
  if(req.body.quantity === undefined) {
    return res.status(400).json({error: "Quantité requise."});
  }

  const quantityBody = req.body.quantity;
  const productIdParam = req.params.productId;
  var shoppingCart = req.session.shoppingCart;

  var product = getProductIntoShoppingCart(shoppingCart, productIdParam);
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
    res.status(204).json({message : "ok"});
  }
});

router.delete("/api/shopping-cart/:productId", function(req, res) {
  const productIdParam = req.params.productId;
  var shoppingCart = req.session.shoppingCart;
  removeProduct(shoppingCart, productIdParam, res);
});

router.delete("/api/shopping-cart", function(req, res) {
  req.session.shoppingCart = [];
  return res.status(204).json({message:"ok"});
});

function getProductIntoShoppingCart(listProducts, productId) {
  /** On fait comme ça car le .forEach() ne peut être stoppé **/
  for(var i = 0; i < listProducts.length; i++) {
    var elem = listProducts[i];
    if (elem.productId == parseInt(productId)) {
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
      return res.status(204).json({message : "ok"});
    }
  }
  return res.status(404).json({message : "Le produit n'existe pas dans le panier."});
}

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

function isGoodQuantity(quantity) {
  var test = Number.isInteger(quantity) && quantity > 0;
  return test;
}

function checkProductAndQuantity(productId, quantity, req) {
  var errorToReturn = {};
  /** TODO : mettre get ... à la place **/
  if(isProductIntoShoppingCart(productId, req)) {
    errorToReturn.status = 400;
    errorToReturn.message = "Le produit associé à l'identifiant spécifié a déjà été ajouté dans le panier.";
  } else if (!isGoodQuantity(quantity)) {
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
