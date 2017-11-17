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
      return res.status(505).json({ error : err });
    }
    return res.status(200).json(orders);
  });
});

router.get("/api/orders/:id", function(req, res) {
  var options = {};
  options.id = req.params.id;
  Order.find(options, function (error, orders) {
    if (error) {
      return res.status(504).json({ error : error });
    } else if(orders.length !== 1) {
      return res.status(404).json({ error : error });
    }
    return res.status(200).json(orders[0]);
  });
});

router.post("/api/orders", function(req, res) {
  var order = new Order({
    id : req.body.id,
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    email : req.body.email,
    phone : req.body.phone,
    products : req.body.products
  });

  var error = checkParameters(order);
  if(error !== "") {
    return res.status(400).json({error : error});
  } else {
    addNewOrder(order, req, res);
  }
});

router.delete("/api/orders/:id", function(req, res) {
  var option = {};
  option.id = req.params.id;
  Order.remove(option, function (error, orders) {
    if (error) {
      return res.status(503).send({ error : error });
    } else if(orders.result.n === 0){
      return res.status(404).json({error : "L'id spécifié n’est pas associé à une commande se trouvant dans la base de données."});
    }
    return res.status(204).send();
  });
});

router.delete("/api/orders", function(req, res) {
  Order.remove({}, function (error) {
    if (error) {
      return res.status(502).json({ error : error});
    }
    return res.status(204).send();
  });
});

router.get("/api/orders/ids/newIdAvailable", function(req, res) {
  var query = Order.find().select('id').sort({id : -1}).limit(1);
  query.exec(function (err, orderIds) {
    if(err) {
      return res.status(501).json({error : err});
    } else if (orderIds.length !== 1) {
      return res.status(200).json({newId : 1});
    }
    return res.status(200).json({newId : orderIds[0].id+1});
  })

});

function addNewOrder(order, req, res) {
  var options = {};
  options.id = order.id;
  Order.find(options, function (err, orders) {
    if (err) {
      return res.status(500).json({error : err});
    } else if (orders.length !== 0) {
      return res.status(400).json({error : "L'identifiant spécifié est déjà utilisé."});
    } else {
      // var error = checkParameters(order);
      // if(error !== "") {
      //   return res.status(400).json({error : error});
      // } else {
        var productIds = [];
        for (var i = 0; i < order.products.length; i++) {
          productIds.push(order.products[i].id);
        }
        var query = Product.find({id : { $in: productIds}}).select('id');
        query.exec(function (err, products) {
          if(err) {
            return res.status(500).json({error : err});
          } else if (!checkProductIds(products,productIds)){
            return res.status(400).json({error : "Un ou plusieurs identifiants de produit sont invalide"});
          }
          order.save(function (err) {
            if (err) {
              return res.status(500).json({error : error});
            }
            req.session.shoppingCart = undefined;
            return res.status(201).json({message : "OK"});
          });

        })
      // }
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
  // .replace(/-/g,'') sinon test ne marche pas avec les '-'
  if(!order.phone || !validator.isMobilePhone(order.phone.replace(/-/g,''), "en-CA")){
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

function checkProductIds(products, productIds) {
  if(products.length !== productIds.length) {
    return false;
  }

  for (var i = 0; i < productIds.length; i++) {
    if(!checkProductId(products,productIds[i])){
      return false;
    }
  }
  return true;
}

function checkProductId(products, productId) {
  for (var i = 0; i < products.length; i++) {
      if(products[i].id === productId) {
        return true;
      }
  }
  return false;
}

module.exports = router;
