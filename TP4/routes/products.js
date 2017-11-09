var express = require("express");
var router = express.Router();
var validator = require('validator');
var db = require('../lib/db');
var Product = require('../models/product');
var Utils = require('../utils/utils');


router.get("/api/products", function(req, res) {
  const category = req.query.category;
  const criteria = req.query.criteria;

  const error = checkCategoryAndCriteria(category,criteria);

  if(!(error === "")) {
    return res.status(400).json({ error: error })
  } else {
    var options = {};
    if(category !== undefined && category !== '') {
      options.category = category;
    }
    Product.find(options, function (err, products) {
      if (err) {
        return res.status(500).json({ error : err });
      }
      return res.status(200).json(sortProducts(products,criteria));
    });
  }
});

router.get("/api/products/:id", function(req, res) {
  var options = {};
  options.id = req.params.id;
  Product.find(options, function (error, products) {
    if (error) {
      return res.status(500).json({ error : error });
    } else if(products.length != 1) {
      return res.status(404).json({ error : error });
    }
    return res.status(200).json(products[0]);
  });
});


router.post("/api/products", function(req, res) {
  var product = new Product({
    id : req.body.id,
    name : req.body.name,
    price : req.body.price,
    image : req.body.image,
    category : req.body.category,
    description : req.body.description,
    features : req.body.features
  });

  const error = checkNewProduct(product);

  if(!(error === "")) {
    return res.status(400).json({ error : error });
  }
  product.save(function (error) {
    if (error) {
      return res.status(400).json({ error : error });
    }
    return res.status(201).json({message : "OK"});
  });
});

router.delete("/api/products/:id", function(req, res) {
  var options = {};
  options.id = req.params.id;
  Product.remove(options, function (error, products) {
    if (error) {
      return res.status(500).send({ error : error });
    } else if(products.result.n === 0){
      return res.status(404).json({error : "L'id spécifié n’est pas associé à un produit se trouvant dans la base de données."});
    }
    return res.status(204).send();
  });
});

router.delete("/api/products", function(req, res) {
  Product.remove({}, function (error) {
    if (error) {
      return res.status(500).json({ error : error});
    }
    return res.status(204).send();
  });
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
  if(products.length > 1) {
    switch (criteria) {
      case "alpha-asc":
        return utils.sortJSON(products, "name", "asc");
      case "alpha-dsc":
        return utils.sortJSON(products, "name", "dsc");
      case "price-asc":
        return utils.sortJSON(products, "price", "asc");
      case "price-dsc":
        return utils.sortJSON(products, "price", "dsc");
      case undefined :
      case "" :
      default :
        return utils.sortJSON(products, "price", "asc");
    }
  }
  return products;
}

function checkCategoryAndCriteria(category, criteria) {
  var utils = new Utils();
  var testCategory = true;
  var testCriteria = true;
  if(category !== undefined) {
    if(utils.isString(category)) {
      testCategory = validator.isIn(category, ['', 'cameras', 'computers', 'consoles', 'screens']);
    } else {
      testCategory = false;
    }
  }
  if(criteria !== undefined) {
    if(utils.isString(criteria)) {
      testCriteria = validator.isIn(criteria, ['','alpha-asc','alpha-dsc','price-asc','price-dsc']);
    } else {
      testCriteria = false;
    }
  }

  var error = "";
  if(!testCategory && !testCriteria) {
    error += "\nCritère et catégorie invalides.";
  } else if(!testCategory) {
    error += "Catégorie invalide.";
  } else if(!testCriteria) {
    error += "Critère invalide.";
  }

  return error;
}
function checkNewProduct(product) {
  var utils = new Utils();
  var error = "";

  if(!product.id || !Number.isInteger(product.id)) {
    error += "\nLe paramètre 'id' doit être nombre entier unique.";
  }
  if(!product.name || !utils.isString(product.name) || (product.name === "")){
    error += "\nLe paramètre 'name' doit être une chaîne de caractères non vide.";
  }
  if(!product.price || !utils.isNumber(product.price) || product.price <= 0){
    error += "\nLe paramètre 'price' doit être un nombre réel positif.";
  }
  if(!product.image || !utils.isString(product.image) || (product.image === "")){
    error += "\nLe paramètre 'image' doit être une chaîne de caractères non vide.";
  }
  if(!product.category || !utils.isString(product.category) || !validator.isIn(product.category, ["cameras", "computers", "consoles", "screens"])){
    error += "\nLe paramètre 'category' doit être parmi les valeurs " +
      "suivantes : cameras, computers, consoles, screens.";
  }
  if(!product.description || !utils.isString(product.description) || (product.description === "")){
    error +="\nLe paramètre 'description' doit être une chaîne de caractères non vide.";
  }
  if(!product.features || product.features.length === 0){
    error += "\nLe paramètre 'features' doit être une liste de chaînes de caractères non vides.";
  } else {
    for (var i = 0; i < product.features.length; i++) {
      if (!product.features[i] || !utils.isString(product.features[i]) || (product.features[i] === "")) {
        error += "\nLe paramètre 'features' doit être une liste de chaînes de caractères non vides.";
        break;
      }
    }
  }

  return error;
}

module.exports = router;
