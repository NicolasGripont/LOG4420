var Product = require('../models/product');

class ShoppingCartController {

  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  findProducts() {
    var self = this;
    var products = [];

    self.initShoppingCart();
    self.req.session.shoppingCart.forEach(function(elem) {
      var product = { productId : elem.productId, quantity : elem.quantity };
      products.push(product);
    });

    return self.res.status(200).json(products);
  }

  initShoppingCart() {
    if (!this.req.session.shoppingCart) {
      this.req.session.shoppingCart = [];
    }
  }

  findProduct(productId) {
    var self = this;

    if(productId) {
      self.initShoppingCart();
      const shoppingCart = self.req.session.shoppingCart;
      var product = self.getProductFromShoppingCart(shoppingCart, productId);
      if(product.productId) {
        return self.res.status(200).json(product);
      }
      return self.res.status(404).json({error : "L'identifiant spécifié n'est pas associé à un élément qui se trouve dans le panier"});
    } else {
      return self.res.status(404).json({error: "Url invalide."});
    }
  }

  getProductFromShoppingCart(shoppingCart, productId) {
    for(var i = 0; i < shoppingCart.length; i++) {
      var elem = shoppingCart[i];
      if (elem.productId == productId) {
        return elem;
      }
    }
    return {};
  }

  addNewProduct(productIdBody, quantityBody) {
    var self = this;
    if(!productIdBody || !quantityBody) {
      return self.res.status(400).json({error: "Paramètre(s) manquant(s) ou invalide(s)."});
    }
    self.initShoppingCart();
    self.addNewProductInShoppingCart(self.req.session.shoppingCart, productIdBody, quantityBody);
  }

  updateQuantity(productIdParam, quantityBody) {
    var self = this;
    var shoppingCart = self.req.session.shoppingCart;

    var product = self.getProductFromShoppingCart(shoppingCart, productIdParam);
    var error = {};

    if(!product.productId) {
      error.status = 404;
      error.message = "Le produit n'existe pas dans le panier.";
    } else if (!self.isGoodQuantity(quantityBody)) {
      error.status = 400;
      error.message = "La quantité spécifiée est invalide.";
    }

    if(error.status) {
      self.res.status(error.status).json({message : error.message});
    } else {
      product.quantity = quantityBody;
      self.res.status(204).send();
    }
  }

  removeProduct(productIdParam) {
    var self = this;
    if(productIdParam) {
      var listProducts = self.req.session.shoppingCart;
      for(var i = 0; i < listProducts.length; i++) {
        var elem = listProducts[i];
        if (elem.productId === parseInt(productIdParam)) {
          listProducts.splice(i,1);
          return self.res.status(204).send();
        }
      }
      return self.res.status(404).json({message : "Le produit n'existe pas dans le panier."});
    } else {
      return self.res.status(404).json({error: "Url invalide."});
    }
  }

  removeProducts() {
    var self = this;
    self.req.session.shoppingCart = [];
    return self.res.status(204).send();
  }

  addNewProductInShoppingCart(shoppingCart, productId, quantity) {
    var self = this;
    var options = {};
    var error = {};
    options.id = productId;
    Product.find(options, function (err, products) {
      if (err) {
        error.status = 500;
        error.message = err;
      } else if (products.length !== 1) {
        error.status = 400;
        error.message = "L'identifiant spécifié n'existe pas.";
      } else {
        error = self.checkProductAndQuantity(shoppingCart, productId, quantity);
      }
      if(!error.status && !error.message) {
        shoppingCart.push({productId : productId, quantity : quantity});
        return self.res.status(201).json({message : "OK"});
      }
      return self.res.status(error.status).json({message : error.message});
    });
  }

  checkProductAndQuantity(shoppingCart, productId, quantity) {
    var self = this;
    var errorToReturn = {};
    var product = self.getProductFromShoppingCart(shoppingCart, productId);
    if(product.productId) {
      errorToReturn.status = 400;
      errorToReturn.message = "Le produit associé à l'identifiant spécifié a déjà été ajouté dans le panier.";
    } else if (!self.isGoodQuantity(quantity)) {
      errorToReturn.status = 400;
      errorToReturn.message = "La quantité spécifiée n'est pas valide.";
    }
    return errorToReturn;
  }

  isGoodQuantity(quantity) {
    return Number.isInteger(quantity) && quantity > 0;
  }

}

module.exports = ShoppingCartController;
