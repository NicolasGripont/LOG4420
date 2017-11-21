var validator = require('validator');
var Product = require('../models/product');
var Utils = require('../utils/utils');

class ProductsController {

  constructor(res) {
    this.res = res;
  }

  findProducts(category, criteria) {
    var self = this;

    const error = self.checkCategoryAndCriteria(category,criteria);

    if(!(error === "")) {
      return self.res.status(400).json({ error: error })
    } else {
      var options = {};
      if(category !== undefined && category !== '') {
        options.category = category;
      }
      Product.find(options, function (err, products) {
        if (err) {
          return self.res.status(500).json({ error : err });
        }
        return self.res.status(200).json(self.sortProducts(products,criteria));
      });
    }
  }

  findProduct(id) {
    var self = this;

    var options = {};

    if(id) {
      options.id = id;
      Product.find(options, function (error, products) {
        if (error) {
          return self.res.status(500).json({error: error});
        } else if (products.length != 1) {
          return self.res.status(404).json({error: error});
        }
        return self.res.status(200).json(products[0]);
      });
    } else {
      return self.res.status(404).json({error: "Url invalide."});
    }
  }

  createProduct(product) {
    var self = this;

    const error = self.checkNewProduct(product);

    if(!(error === "")) {
      return self.res.status(400).json({ error : error });
    }
    product.save(function (error) {
      if (error) {
        return self.res.status(400).json({ error : error });
      }
      return self.res.status(201).json({message : "OK"});
    });
  }

  deleteProduct(id) {
    var self = this;

    var options = {};

    if(id) {
      options.id = id;
      Product.remove(options, function (error, products) {
        if (error) {
          return self.res.status(500).send({error: error});
        } else if (products.result.n === 0) {
          return self.res.status(404).json({error: "L'id spécifié n’est pas associé à un produit se trouvant dans la base de données."});
        }
        return self.res.status(204).send();
      });
    } else {
      return self.res.status(404).json({error: "Url invalide."});
    }
  }

  deleteProducts() {
    var self = this;
    Product.remove({}, function (error) {
      if (error) {
        return self.res.status(500).json({ error : error});
      }
      return self.res.status(204).send();
    });
  }

  sortProducts(products, criteria) {
    var utils = new Utils();
    if(products && products.length > 1) {
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

  checkCategoryAndCriteria(category, criteria) {
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

  checkNewProduct(product) {
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

}

module.exports = ProductsController;
