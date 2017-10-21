"use strict";

function ProductsView(model, elements) {
  this._model = model;
  this._elements = elements;

  this.categoryButtonClickedEvent = new Event(this);
  this.criteriaButtonClickedEvent = new Event(this);

  var _this = this;

  // attach model listeners
  this._model.currentProductsChangedEvent.attach(function () {
    _this.rebuildProducts();
  });

  // attach listeners to HTML controls
  $.each(this._elements.categoriesButtonsGroups.children(), function(i, button) {
    $(button).click(function(e) {
      _this.unselectButton(e.target);
      _this.selectButton(e.target);
      _this.categoryButtonClickedEvent.notify({category: $(e.target).attr("category")});
    })
  });

  $.each(this._elements.criteriaButtonsGroups.children(), function(i, button) {
    $(button).click(function(e) {
      _this.unselectButton(e.target);
      _this.selectButton(e.target);
      _this.criteriaButtonClickedEvent.notify({criteria: $(e.target).attr("criteria"), orderBy: $(e.target).attr("orderBy")});
    })
  });
};

ProductsView.prototype = {
  show : function () {
      this.rebuildProducts();
  },

  unselectButton : function (button) {
    $.each($(button).parent().children(), function(i, item) {
      $(item).removeClass("selected");
    });
  },
  
  selectButton : function (button) {
    $(button).addClass("selected");
  },

  rebuildProducts : function () {
    var _this = this
    var products, productsList, productsCount;

    productsList = this._elements.productsList;
    productsCount = this._elements.productsCount;
    productsList.empty();

    products = this._model.getProducts();
    if(products) {
      $.each(products, function(i, item) {
        productsList.append(_this.createProductHtml(item));
      });
      productsCount.html(products.length + " produits");
    }
  },

  createProductHtml : function (jsonProduct) {
    const produit = '<div class="product">' +
                    '  <a href="product.html?id='+ jsonProduct["id"] +'" title="En savoir plus...">' +
                    '    <h2>' + jsonProduct["name"] + '</h2>' +
                    '    <img src="./assets/img/' + jsonProduct["image"] + '" alt="' + jsonProduct["image"] + '"/>' +
                    '    <p class="product-price">' + jsonProduct["price"].toString().replace('.',",") + '&thinsp;$</p>' +
                    '  </a>' +
                    '</div>';
    return produit;
  }, 

  showMessageError : function(message) {
    $(this._elements.main).html("<h1>" + message + "</h1>");
  }
};




