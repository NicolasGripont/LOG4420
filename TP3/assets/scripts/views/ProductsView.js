var ProductsModel = function (model) {
  this.model = model;
};

Product.prototype = {
  sort : function() {
    
  }

  filter : function() {

  }

  sortAndFilter : function() {

  }
};


function createProductHtml(jsonProduct) {
  const produit = '<div class="product">' +
                  '  <a href="product.html?id='+ jsonProduct["id"] +'" title="En savoir plus...">' +
                  '    <h2>' + jsonProduct["name"] + '</h2>' +
                  '    <img src="./assets/img/' + jsonProduct["image"] + '" alt="' + jsonProduct["image"] + '"/>' +
                  '    <p class="product-price">CDN$' + jsonProduct["price"] +'</p>' +
                  '  </a>' +
                  '</div>';
  return produit;
}