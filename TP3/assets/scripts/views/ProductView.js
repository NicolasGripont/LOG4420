"use strict";

function ProductView(model, elements) {
  this._model = model;
  this._elements = elements;
  this.quantityChangedEvent = new Event(this);
  this.addToCartButtonClickedEvent = new Event(this);
  var _this = this;

  // attach listeners to HTML controls
  this._elements.productQuantity.change(function(e) {
    _this.quantityChangedEvent.notify({quantity : parseInt($(e.target).val())});
  })

  this._elements.addToCartButton.click(function(e) {
    _this.addToCartButtonClickedEvent.notify();
    //block l'envoi du formulaire
    return false;
  })
};

ProductView.prototype = {
  show : function () {
      this.rebuildProduct();
  },

  rebuildProduct : function () {
    var product = this._model.getProduct();
    if(product) {
      $(this._elements.productName).html(product.name);
      $(this._elements.productImage).attr("for", product.name);
      $(this._elements.productImage).attr("src", "./assets/img/" + product.image);
      $(this._elements.productDesc).html(product.description);
      $(this._elements.productFeatures).append(this.createFeaturesHtml(product.features));
      $(this._elements.productPrice).html('Prix: <strong>' + product.price.toString().replace(".",",") + '&thinsp;$</strong>');                  
    }
  }, 

  createFeaturesHtml : function(features) {
    var listFeatures = "";
    $.each(features, function(i, feature) {
      listFeatures += '<li>' + feature + '</li>';
    });
    return listFeatures;
  },

  showMessageError : function(message) {
    $(this._elements.main).html("<h1>" + message + "</h1>");
  },

  showDialogMessage : function(message) {
    var dialog = $(this._elements.dialog);
    dialog.addClass("show");
    setTimeout(function(){ dialog.removeClass("show"); }, 5000);
  },


  updateQuantity : function(quantity) {
    this._elements.productQuantity.val(quantity);
  }

};


