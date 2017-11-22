var Order = require('../models/order');
var Product = require('../models/product');
var Utils = require('../utils/utils');
var Validator = require('validator');
var Promise = require('promise');

/**
 * Controller Of the Order API
 */
class OrderController {

  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  /**
   * Get the Orders corresponding to the id and send it to the client
   */
  findOrders() {
    var self = this;

    var options = {};

    Order.find(options, function (err, orders) {
      if (err) {
        return self.res.status(505).json({error: err});
      }
      return self.res.status(200).json(orders);
    });
  }

  /**
   * Get the Order corresponding to the id and send it to the client
   * @param id
   */
  findOrder(id) {
    var self = this;

    var options = {};

    if(id) {
      options.id = id;
      Order.find(options, function (error, orders) {
        if (error) {
          return self.res.status(504).json({error: error});
        } else if (orders.length !== 1) {
          return self.res.status(404).json({error: error});
        }
        return self.res.status(200).json(orders[0]);
      });
    } else {
      return self.res.status(404).json({error: "Url invalide."});
    }
  }

  /**
   * Create the order in DB
   *
   * @param order Order to create
   */
  createOrder(order) {
    var self = this;
    var error = this.checkParameters(order);
    if(error !== "") {
      return this.res.status(400).json({error : error});
    } else {
      self.ckeckOrderId(order)
        .then(function() {
          self.ckeckProductsId(order)
            .then(function () {
              self.saveOrder(order)
                .then(function(success){
                  return self.res.status(success.status).json({ error : success.message});
                })
                .catch(function(error){
                  return self.res.status(error.status).json({ error : error.message});
                });
            })
            .catch(function(error){
              return self.res.status(error.status).json({ error : error.message});
            });
        })
        .catch(function(error){
          return self.res.status(error.status).json({ error : error.message});
        });
    }
  }

  /**
   * Delete the Order corresponding to the id from the DB
   * @param id
   */
  deleteOrder(id) {
    var self = this;

    if(id) {
      var option = {};
      option.id = id;

      Order.remove(option, function (error, orders) {
        if (error) {
          return self.res.status(503).send({error: error});
        } else if (orders.result.n === 0) {
          return self.res.status(404).json({error: "L'id spécifié n’est pas associé à une commande se trouvant dans la base de données."});
        }
        return self.res.status(204).send();
      });
    } else {
      return self.res.status(404).json({error: "Url invalide."});
    }
  }

  /**
   * Delete all Orders from the DB
   * @param id
   */
  deleteOrders() {
    var self = this;

    var options = {};

    Order.remove(options, function (error) {
      if (error) {
        return self.res.status(502).json({ error : error});
      }
      return self.res.status(204).send();
    });
  }

  /**
   * Get the next available id for Order in DB and send it to the client
   */
  getNewIdAvailable() {
    var self = this;

    var query = Order.find().select('id').sort({id : -1}).limit(1);

    query.exec(function (err, orderIds) {
      if(err) {
        return self.res.status(501).json({error : err});
      } else if (orderIds.length !== 1) {
        return self.res.status(200).json({newId : 1});
      }
      return self.res.status(200).json({newId : orderIds[0].id+1});
    })
  }

  /**
   * Check the availability of the order id
   * @param order  Order to check id
   * @returns {*|Promise} A promise that contains the order checked or an error (status message).
   */
  ckeckOrderId(order) {
    return new Promise(function(resolve, reject) {
        var options = {};
        options.id = order.id;
        Order.find(options, function (err, orders) {
          if (err) {
            return reject({status : 500, message : err});
          } else if (orders.length !== 0) {
            return reject({status : 400, message : "L'identifiant spécifié est déjà utilisé."});
          } else {
            return resolve(order);
          }
        });
    });
  }

  /**
   * Check the produtct ids
   * @param order  Order to check the products id
   * @returns {*|Promise} A promise that contains the order checked or an error (status message).
   */
  ckeckProductsId(order) {
    var self = this;
    return new Promise(function(resolve, reject) {
      var productIds = [];
      for (var i = 0; i < order.products.length; i++) {
        productIds.push(order.products[i].id);
      }
      var query = Product.find({id: {$in: productIds}}).select('id');
      query.exec(function (error, products) {
        if (error) {
          return reject({status : 500, message: err});
        } else if (!self.checkProductIds(products, productIds)) {
          return reject({status : 400, message: "Un ou plusieurs identifiants de produit sont invalide"});
        } else {
          return resolve(order);
        }
      });
    });
  }

  /**
   * Save the order in DB
   * @param order Order to save
   * @returns {*|Promise} A promise that contains a result message (status message).
   */
  saveOrder(order) {
    var self = this;
    return new Promise(function(resolve, reject) {
      order.save(function (error) {
        if (error) {
          return reject({status : 500, message: error});
        }
        self.req.session.shoppingCart = undefined;
        return resolve({status : 201, message: "OK"});
      });
    });
  }

  /**
   * Check if the order attributes are valid
   * @param order Order to check
   * @returns {string} Empty string if no error in order attributes, else error messsage(s)
   */
  checkParameters(order) {
    var utils = new Utils();
    var error = "";

    if(!order.id || !Number.isInteger(order.id)) {
      error += "\nLe paramètre 'id' doit être nombre entier.";
    }
    if(!order.firstName || !utils.isString(order.firstName) || (order.firstName === "")){
      error += "\nLe paramètre 'firstName' doit être une chaîne de caractères non vide.";
    }
    if(!order.lastName || !utils.isString(order.lastName) || (order.lastName === "")){
      error += "\nLe paramètre 'lastName' doit être une chaîne de caractères non vide.";
    }
    if(!order.email || !Validator.isEmail(order.email)){
      error += "\nLe paramètre 'email' doit être une adresse mail valide.";
    }
    // .replace(/-/g,'') sinon test ne marche pas avec les '-'
    if(!order.phone || !Validator.isMobilePhone(order.phone.replace(/-/g,''), "en-CA")){
      error += "\nLe paramètre 'phone' doit être un numéro de téléphone valide.";
    }
    if(!order.products || order.products.length === 0){
      error += "\nLe paramètre 'products' doit être une liste de chaînes de produits non vides.";
    } else {
      for (var i = 0; i < order.products.length; i++) {
        if (!order.products[i].id || !Number.isInteger(order.products[i].id) || order.products[i].id < 0) {
          error += "\nLe paramètre 'products.id' doit être un nombre entier.";
          break;
        }
        if (!order.products[i].quantity || !Number.isInteger(order.products[i].quantity)
          || order.products[i].quantity === 0) {
          error += "\nLe paramètre 'products.quantity' doit être un nombre entier positif.";
          break;
        }
      }
    }
    return error;
  }

  /**
   * Check if the products ID of the 'productIds' array are in the 'products' array
   * @param possible products
   * @param productIds Product IDs to check
   * @returns {boolean} return true if all ID of the 'productIds' array are in the 'products' array, else false
   */
  checkProductIds(products, productIds) {
    if(products.length !== productIds.length) {
      return false;
    }

    for (var i = 0; i < productIds.length; i++) {
      if(!this.checkProductId(products,productIds[i])){
        return false;
      }
    }
    return true;
  }

  /**
   * Check if the products id of the 'productIds' array are in the 'products' array
   * @param possible products
   * @param productId Product ID to check
   * @returns {boolean} return true if the 'productId' is in the 'products' array, else false
   */
  checkProductId(products, productId) {
    for (var i = 0; i < products.length; i++) {
      if(products[i].id === productId) {
        return true;
      }
    }
    return false;
  }
}

module.exports = OrderController;
