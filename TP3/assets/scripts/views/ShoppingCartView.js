"use strict";

function ShoppingCartView(model, elements) {
  this._model = model;
  this._elements = elements;
  this.productligns = {};
  this.removeProductButtonClickedEvent = new Event(this);
  this.emptyShoppingCartButtonClickedEvent = new Event(this);
  this.commandButtonClickedEvent = new Event(this);
  this.quantityProductButtonClickedEvent = new Event(this);
  var _this = this;

  // attach listeners to HTML controls
  this._elements.emptyShoppingCartButton.click(function(e) {
    _this.emptyShoppingCartButtonClickedEvent.notify();
  })
};

ShoppingCartView.prototype = {
  show : function () {
      this.rebuildShoppingCart();
  },

  rebuildShoppingCart : function () {
    var _this = this
    var shoppingCart = this._model.getShoppingCart();
    var products = this._model.getProducts();
    if(shoppingCart && this._model.getNumberOfProducts()) {
      $(this._elements.tbody).empty();
      $.each(products,function(i, item) {
        $(_this._elements.tbody).append(_this.createTableLignHtml(shoppingCart[item.id]["product"],shoppingCart[item.id]["quantity"]));
      });
    }
    this.updateTotal();
  }, 

  createTableLignHtml : function(product, quantity) {
    var self = this;
    var lign = $('<tr productId="'+product.id+'"">' +
                 '  <td><button class="remove-item-button" title="Supprimer"><i class="fa fa-times"></i></button></td>' +
                 '  <td><a href="./product.html?id=' + product.id + '"> ' + product.name + '</a></td>' +
                 '  <td>' + product.price.toString().replace(".",",") + '&thinsp;$</td>' +
                 '  <td>' +
                 '    <div class="row">' +
                 '      <div class="col">' +
                 '        <button class="remove-quantity-button" title="Retirer" disabled><i class="fa fa-minus"></i></button>' +
                 '      </div>' +
                 '      <div class="col quantity">' + quantity + '</div>' +
                 '      <div class="col">' +
                 '        <button class="add-quantity-button" title="Ajouter"><i class="fa fa-plus"></i></button>' +
                 '      </div>' +
                 '    </div>' +
                 '  </td>' +
                 '  <td class="price">' + (product.price * quantity).toFixed(2).toString().replace(".",",") + '&thinsp;$</td>' +
                 '</tr>');
    var minusButton = lign.find("button.remove-quantity-button"); //TODO USE CLASS
    if(quantity > 1) {
      minusButton.removeAttr("disabled");
    }
    minusButton.click(function() {
      self.quantityProductButtonClickedEvent.notify({"productId" : product.id, "deltaQuantity" : -1});
    }); 

    var plusButton = lign.find("button.add-quantity-button");
    plusButton.click(function() {
      self.quantityProductButtonClickedEvent.notify({"productId" : product.id, "deltaQuantity" : 1});
    });

    var removeButton = lign.find("button.remove-item-button");
    removeButton.click(function() {
      self.removeProductButtonClickedEvent.notify({"productId" : product.id});
    });

    return lign;
  },

  showMessageError : function(message) {
    $(this._elements.main).css("display","block");
    $(this._elements.main).html("<h1>Panier</h1><p>" + message + "</p>");
  },

  productRemoved : function(productId) {
    $('tr[productId="' + productId + '"]').remove();
    this.updateTotal();
  },

  quantityChanged : function(productId) {
    var shoppingCart = this._model.getShoppingCart();
    var quantity = shoppingCart[productId].quantity;
    var product = shoppingCart[productId].product;
    $('tr[productId="' + productId + '"] .quantity').html(quantity);
    $('tr[productId="' + productId + '"] .price').html((product.price * quantity).toFixed(2).toString().replace(".",",") + '&thinsp;$');
    this.updateTotal();
    if(quantity <= 1) {
      $('tr[productId="' + productId + '"] button.remove-quantity-button').attr("disabled",true);
    } else {
      $('tr[productId="' + productId + '"] button.remove-quantity-button').removeAttr("disabled");
    }
  },

  showModalConfirmMessage : function(message) {
    return (confirm(message) == true) 
  }, 

  updateTotal : function() {
    $(this._elements.total).html(this._model.getTotalAmount().toFixed(2).toString().replace(".",",") + '&thinsp;$');
  }

};


