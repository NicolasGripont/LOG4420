var onlineShop = onlineShop || {};

/**
 * Provides some useful functions.
 *
 * @author Antoine Beland <antoine.beland@polymtl.ca>
 * @author Konstantinos Lambrou-Latreille <konstantinos.lambrou-latreille@polymtl.ca>
 */
onlineShop.utils = {

  /**
   * Gets the value of the URL parameter associated with the specified name.
   *
   * @param name          The name of the parameter to retrieve.
   * @returns {*|number}  The value of the parameter.
   * @see https://www.sitepoint.com/url-parameters-jquery/
   */
  getUrlParameter: function(name) {
    var results = new RegExp("[\?&]" + name + "=([^&#]*)").exec(window.location.href);
    return results[1] || 0;
  },

  /**
   * Formats the specified number as a price.
   *
   * @param price         The price to format.
   * @returns {string}    The price formatted.
   */
  formatPrice: function(price) {
    return price.toFixed(2).replace(".", ",") + "&thinsp;$";
  },

  /**
   * Pads a number with zeros or a specified symbol.
   *
   * @param number      The number to format.
   * @param width       The total width of the formatted number.
   * @param symbol      The padding symbol to use. By default, the symbol is '0'.
   * @returns {*}       The formatted number.
   * @see https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
   */
  pad: function(number, width, symbol) {
    symbol = symbol || '0';
    number = number + '';
    return number.length >= width ? number : new Array(width - number.length + 1).join(symbol) + number;
  },

  sortJSON : function(products, criteria, orderBy) {
    products = products.sort(function(a, b) {
      if (orderBy === undefined || orderBy === "asc") {
        if(typeof(a[criteria]) === "string") {
          return (a[criteria].toLowerCase() > b[criteria].toLowerCase()) ? 1 : ((a[criteria].toLowerCase() < b[criteria].toLowerCase()) ? -1 : 0);
        }
        return (a[criteria] > b[criteria]) ? 1 : ((a[criteria] < b[criteria]) ? -1 : 0);
      } else if(orderBy === "dsc") {
        if(typeof(a[criteria]) === "string") {
          return (b[criteria].toLowerCase() > a[criteria].toLowerCase()) ? 1 : ((b[criteria].toLowerCase() < a[criteria].toLowerCase()) ? -1 : 0);
        }
        return (b[criteria] > a[criteria]) ? 1 : ((b[criteria] < a[criteria]) ? -1 : 0);
      }
    });
    return products;
  }
};
