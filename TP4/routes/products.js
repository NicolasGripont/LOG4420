var express = require("express");
var router = express.Router();
var validator = require('validator');
var db = require('../lib/db');
var Product = require('../models/product');
var Utils = require('../utils/utils');

router.get("/produits", function(req, res) {
  res.render("products", { title: "OnlineShop - Produits", activeLi: "Produits"});
});

router.get("/produit", function(req, res) {
  res.render("product", { title: "OnlineShop - Produit", activeLi: "Produits"});
});

router.get("/api/products", function(req, res) {
  const category = req.query.category;
  const criteria = req.query.criteria;

  const testCategory = isCategoryValid(category);
  const testCriteria = isCriteriaValid(criteria);

  if(!testCategory && !testCriteria) {
    res.status(400).send({ error: 'Critère et catégorie invalides' })
  } else if(!testCategory) {
    res.status(400).send({ error: 'Catégorie invalide' })
  } else if(!testCriteria) {
    res.status(400).send({ error: 'Critère invalide' })
  } else {
    var options = {};
    if(category !== undefined && category !== '') {
      options.category = category;
    }
    Product.find(options, function (err, products) {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(sortProducts(products,criteria));
    });
  }
});


function isCategoryValid(category) {
  if(category) {
    return validator.isIn(category, ['', 'cameras', 'computers', 'consoles', 'screens']);
  }
  return true;
}

function isCriteriaValid(criteria) {
  if(criteria) {
    return validator.isIn(criteria, ['','alpha-asc','alpha-dsc','price-asc','price-dsc']);
  }
  return true;
}

function sortProducts(products, criteria) {
  var utils = new Utils();
  switch (criteria) {
    case "alpha-asc":
      return utils.sortJSON(products,"name","asc");
    case "alpha-dsc":
      return utils.sortJSON(products,"name","dsc");
    case "price-asc":
      return utils.sortJSON(products,"price","asc");
    case "price-dsc":
      return utils.sortJSON(products,"price","dsc");
    case undefined :
    case "" :
    default :
      return products;
  }
}

module.exports = router;
