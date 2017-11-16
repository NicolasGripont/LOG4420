var express = require("express");
var validator = require('validator');
var router = express.Router();
var Order = require('../models/order');
var Product = require('../models/product');
var Utils = require('../utils/utils');


router.get("/api/orders", function(req, res) {
  var options = {};
  Order.find(options, function (err, orders) {
    if (err) {
      return res.status(500).json({ error : err });
    }
    return res.status(200).json(orders);
  });
});

router.get("/api/orders/:id", function(req, res) {
  var options = {};
  options.id = req.params.id;
  Order.find(options, function (error, orders) {
    if (error) {
      return res.status(500).json({ error : error });
    } else if(orders.length !== 1) {
      return res.status(404).json({ error : error });
    }
    return res.status(200).json(orders[0]);
  });
});

router.post("/api/orders", function(req, res) {
  var products = JSON.parse(req.body.products);
  var order = new Order({
    id : req.body.id,
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    email : req.body.email,
    phone : req.body.phone,
    products : JSON.parse(req.body.products)
  });
  // TODO : Améliorer asynchrone avec find
  checkNewOrder(order, res);
});

router.delete("/api/orders/:id", function(req, res) {
  var option = {};
  option.id = req.params.id;
  Order.remove(option, function (error, orders) {
    if (error) {
      return res.status(500).send({ error : error });
    } else if(orders.result.n === 0){
      return res.status(404).json({error : "L'id spécifié n’est pas associé à une commande se trouvant dans la base de données."});
    }
    return res.status(204).send();
  });
});

router.delete("/api/orders", function(req, res) {
  Order.remove({}, function (error) {
    if (error) {
      return res.status(500).json({ error : error});
    }
    return res.status(204).send();
  });
});

function checkNewOrder(order, res) {
  var options = {};
  options.id = order.id;
  Order.find(options, function (err, orders) {
    if (err) {
      return res.status(500).json({error : err});
    } else if (orders.length !== 0) {
      return res.status(400).json({error : "L'identifiant spécifié est déjà utilisé."});
    } else {
      var message = checkParameters(order);
      if(message !== "") {
        return res.status(400).json({message : message});
      } else {

        // TODO : Check si les id de produits sont bons ?
        order.save(function (error) {
          if (error) {
            return res.status(500).json({error : error});
          }
          return res.status(201).json({message : "OK"});
        });
      }
    }
  });
}

function checkParameters(order) {
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
  if(!order.email || !validator.isEmail(order.email)){
    error += "\nLe paramètre 'email' doit être une adresse mail valide.";
  }
  if(!order.phone || !validator.isMobilePhone(order.phone, "any")){
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


module.exports = router;
