// "use strict";

// function SView(model, elements) {
//   this._model = model;
//   this._elements = elements;

//   this.quantityChangedEvent = new Event(this);
//   this.addToCartButtonClickedEvent = new Event(this);

//   var _this = this;

//   // attach model listeners
//   this._model.quantityChangedEvent.attach(function () {

//   });

//   this._model.productChangedEvent.attach(function () {
//     _this.rebuildProduct();
//   });

//   // attach listeners to HTML controls
//   this._elements.productQuantity.change(function(e) {
//     _this.quantityChangedEvent.notify({quantity : $(e.target).val()});
//   })

//   this._elements.addToCartButton.click(function(e) {
//     _this.addToCartButtonClickedEvent.notify();
//   })
// }

// ProductView.prototype = {
//   show : function () {
//       this.rebuildProduct();
//   },

//   rebuildProduct : function () {
//     var _this = this
//     var product = this._model.getProduct();
//     if(product) {
//       $(this._elements.productName).html(product.name);
//       $(this._elements.productImage).attr("for", product.name);
//       $(this._elements.productImage).attr("src", "./assets/img/" + product.image);
//       $(this._elements.productDesc).html(product.description);
//       $(this._elements.productFeatures).append(_this.createFeaturesHtml(product.features));
//       $(this._elements.productPrice).html('Prix: <strong>' + product.price.toString().replace(".",",") + '&thinsp;$</strong>');                  
//     }
//   }, 

//   createFeaturesHtml : function(features) {
//     var listFeatures = "";
//     $.each(features, function(i, feature) {
//       listFeatures += '<li>' + feature + '</li>';
//     });
//     return listFeatures;
//   },

//   showMessageError : function(message) {
//     $(this._elements.main).html("<h1>" + message + "</h1>");
//   }
// };


