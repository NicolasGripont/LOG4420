var Product = require('../models/product');


/**
 * Controller Of the Shopping Cart API
 */
class ShoppingCartController {

  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  /**
   * Get products and corresponding quantity from the shopping cart
   */
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

  /**
   * Get product and corresponding quantity from the shopping cart and send it to the client
   * @param productId
   */
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
    }
    return self.res.status(404).json({error: "Url invalide."});
  }

  /**
   * Get product and corresponding quantity from the shopping cart
   * @param shoppingCart Shopping cart from where we search the product
   * @param productId Product to get
   * @returns {*} A json object with the product id and corresponding quantity
   */
  getProductFromShoppingCart(shoppingCart, productId) {
    for(var i = 0; i < shoppingCart.length; i++) {
      var elem = shoppingCart[i];
      if (elem.productId == productId) {
        return elem;
      }
    }
    return {};
  }

  /**
   * Add the product in th the session shopping cart
   * @param productId Product id to add
   * @param quantity  Quantity of the product
   */
  addNewProduct(productId, quantity) {
    var self = this;
    if(!productId || !quantity) {
      return self.res.status(400).json({error: "Paramètre(s) manquant(s) ou invalide(s)."});
    }
    self.initShoppingCart();
    self.addNewProductInShoppingCart(self.req.session.shoppingCart, productId, quantity);
  }

  /**
   * Update the product quatity form the session shopping cart
   * @param productId Product id to update quantity
   * @param quantity New quantity
   */
  updateQuantity(productId, quantity) {
    var self = this;
    var shoppingCart = self.req.session.shoppingCart;

    var product = self.getProductFromShoppingCart(shoppingCart, productId);
    var error = {};

    if(!product.productId) {
      error.status = 404;
      error.message = "Le produit n'existe pas dans le panier.";
    } else if (!self.isGoodQuantity(quantity)) {
      error.status = 400;
      error.message = "La quantité spécifiée est invalide.";
    }

    if(error.status) {
      return self.res.status(error.status).json({message : error.message});
    } else {
      product.quantity = quantity;
      return self.res.status(204).send();
    }
  }

  /**
   * Remove product from the session shopping cart
   * @param productId Product ID to remove
   */
  removeProduct(productId) {
    var self = this;
    if(productId) {
      var listProducts = self.req.session.shoppingCart;
      for(var i = 0; i < listProducts.length; i++) {
        var elem = listProducts[i];
        if (elem.productId === parseInt(productId)) {
          listProducts.splice(i,1);
          return self.res.status(204).send();
        }
      }
      return self.res.status(404).json({message : "Le produit n'existe pas dans le panier."});
    } else {
      return self.res.status(404).json({error: "Url invalide."});
    }
  }

  /**
   * Remove all products from the session shopping cart
   */
  removeProducts() {
    var self = this;
    self.req.session.shoppingCart = [];
    return self.res.status(204).send();
  }

  /**
   * Add the product in th the session shopping cart
   * @param shoppingCart Shopping where to add the product
   * @param productId Product id to add
   * @param quantity  Quantity of the product
   */
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

  /**
   * Check if product ID is valid and not in shopping cart and if quantity is valid
   * @param shoppingCart Shopping Cart
   * @param productId Product ID to check
   * @param quantity Quantity to check
   * @returns {{}} An empty json object if OK, else an error json object with a status and a message
   */
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

  /**
   * Check if quantity is an integer
   * @param quantity Quantity to check
   * @returns {boolean} true if quantity is an integer, else false
   */
  isGoodQuantity(quantity) {
    return Number.isInteger(quantity) && quantity > 0;
  }

}

module.exports = ShoppingCartController;
