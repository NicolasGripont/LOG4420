var onlineShop = onlineShop || {};

/**
 * Controls the "products" view.
 *
 * @author Antoine Beland <antoine.beland@polymtl.ca>
 * @author Konstantinos Lambrou-Latreille <konstantinos.lambrou-latreille@polymtl.ca>
 */
(function($, productsService, utils) {
  "use strict";

  var filters = {
    category: "all",
    sortingCriteria: "price-asc"
  };

  /**
   * Updates the product view.
   *
   * @param products    The products list to render.
   * @private
   */
  function _updateView(products) {
    var productsElement = $(".products");
    productsElement.html("");
    products.forEach(function(product) {
      productsElement.append(_createProductElement(product));
    });

    $("#products-count").text(products.length + " produit" +
      (products.length > 1 ? "s" : ""));

    var categoriesElement = $("#product-categories");
    categoriesElement.children().removeClass("selected");
    categoriesElement.find("[data-category=" + filters.category + "]").addClass("selected");

    var criteriaElement = $("#product-criteria");
    criteriaElement.children().removeClass("selected");
    criteriaElement.find("[data-criteria=" + filters.sortingCriteria + "]").addClass("selected");
  }

  /**
   * Creates a product element.
   *
   * @param product                   The product to use.
   * @returns {*|jQuery|HTMLElement}  A jQuery element.
   * @private
   */
  function _createProductElement(product) {
    var template = "<div class='product' data-product-id='" + product.id + "'>" +
      "<a href='./product.html?id=" + product.id + "' title='En savoir plus...'>" +
      "<h2>" + product.name + "</h2>" +
      "<img alt='product' src='./assets/img/" + product.image + "'>" +
      "<p class='price'><small>Prix</small> " + utils.formatPrice(product.price) + "</p>" +
      "</a>" +
      "</div>";

    return $(template);
  }

  // Initialize the products view.
  productsService.getProducts(filters.sortingCriteria, filters.category).done(function(data) {
    _updateView(data);

    $("#product-categories").children().click(function() {
      filters.category = $(this).attr("data-category");
      productsService.getProducts(filters.sortingCriteria, filters.category).done(_updateView);
    });
    $("#product-criteria").children().click(function() {
      filters.sortingCriteria = $(this).attr("data-criteria");
      productsService.getProducts(filters.sortingCriteria, filters.category).done(_updateView);
    });
  });

})(jQuery, onlineShop.productsService, onlineShop.utils);
