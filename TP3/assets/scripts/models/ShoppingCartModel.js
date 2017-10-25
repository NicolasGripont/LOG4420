"use strict";

var ShoppingCartModel = function () {
  this.shoppingCart = {};
  this.products = [];
  this.numberOfProducts = 0;
};

ShoppingCartModel.prototype = {
  getShoppingCart : function() {
    return this.shoppingCart;
  }, 

  getProducts : function() {
    return this.products;
  }, 

  addProduct : function (product, quantity) {
    if(product && quantity) {
      if(this.shoppingCart[product.id]) {
          this.shoppingCart[product.id]["quantity"] += quantity;
      } else {
        this.shoppingCart[product.id] = {};
        this.shoppingCart[product.id]["product"] = product;
        this.shoppingCart[product.id]["quantity"] = quantity;
      }
      this.numberOfProducts += quantity;
    }
  }, 

  getNumberOfProducts : function() {
    return this.numberOfProducts;
  },

  initShoppingCart : function(json) {
    this.numberOfProducts = 0;
    var self = this;
    if(json) {
      this.shoppingCart = json;
      $.each(this.shoppingCart, function(i, item) {
        self.numberOfProducts += item["quantity"];
        self.products.push(item["product"]);
      });
      this.sort("name","asc");
    } else {
      this.shoppingCart = {};
    }
  }, 

  sort : function(criteria, orderBy) {
    if(this.products) {
      //TODO sort list of product
      this.products = this.products.sort(function(a, b) {
        if (orderBy === undefined || orderBy === "asc") {
          if($.type(a[criteria]) === "string") {
            return (a[criteria].toLowerCase() > b[criteria].toLowerCase()) ? 1 : ((a[criteria].toLowerCase() < b[criteria].toLowerCase()) ? -1 : 0);
          }
          return (a[criteria] > b[criteria]) ? 1 : ((a[criteria] < b[criteria]) ? -1 : 0);
        } else if(orderBy === "desc") {
          if($.type(a[criteria]) === "string") {
            return (b[criteria].toLowerCase() > a[criteria].toLowerCase()) ? 1 : ((b[criteria].toLowerCase() < a[criteria].toLowerCase()) ? -1 : 0);
          }
          return (b[criteria] > a[criteria]) ? 1 : ((b[criteria] < a[criteria]) ? -1 : 0);
        }
      });
    }
  }, 

  removeProduct : function(id) {
    if(id) {
      this.numberOfProducts -= this.shoppingCart[id]["quantity"];
      this.shoppingCart[id] = undefined;
      for(var i = 0; i < this.products.length; i++) {
        if(this.products[i].id === id) {
          this.products.splice(i,1);
          break;
        }
      }
    }
  },

  removeAllProducts : function() {
    this.numberOfProduct = 0;
    this.shoppingCart = {};
    this.products = [];
  },

  getTotalAmount : function() {
    var _this = this;
    var totalPrice = 0;
    if(this.numberOfProducts > 0) {
      $.each(this.products,function(i, item) {
        totalPrice += item.price * _this.shoppingCart[item.id]["quantity"];
      });
    }
    return totalPrice;
  },

  changeProductQuantity : function(productId, deltaQuantity) {
    this.numberOfProducts += deltaQuantity;
    this.shoppingCart[productId].quantity +=deltaQuantity;
  }
};