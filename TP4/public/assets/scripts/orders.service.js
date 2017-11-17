var onlineShop = onlineShop || {};

/**
 * Defines a service to manage the orders.
 *
 * @author Antoine Beland <antoine.beland@polymtl.ca>
 * @author Konstantinos Lambrou-Latreille <konstantinos.lambrou-latreille@polymtl.ca>
 */
onlineShop.ordersService = (function() {
  "use strict";

  var self = {};
  var orders = [];

  /**
   * Creates a new order.
   *
   * @param order   The order to create.
   */
  self.createOrder = function(order, callback) {
    $.ajax({
      url: "/api/orders/ids/newIdAvailable",
      type: "GET",
    })
    .done(function(data) {
      order.id = data.newId;
      $.ajax({
        url: "/api/orders",
        type: "POST",
        data : JSON.stringify({
          id : order.id,
          firstName : order.firstName,
          lastName : order.lastName,
          email : order.email,
          phone : order.phone,
          products : order.products
        }),
        processData: false,
        contentType: "application/json; charset=UTF-8"
      })
      .done(function() {
        if (order) {
          orders.push(order);
          _updateLocalStorage();
        }
        callback();
      });
    });
  };

  /**
   * Gets the order based on the specified ID.
   *
   * @param orderId   The ID of the order.
   * @returns {*}     The order associated with the specified ID.
   */
  self.getOrder = function(orderId) {
    if (orderId <= 0 || orderId > orders.length) {
      throw new Error("Invalid order ID specified.")
    }
    return orders[orderId - 1];
  };

  /**
   * Gets the orders count.
   *
   * @returns {Number}  The orders count.
   */
  self.getOrdersCount = function() {
    return orders.length;
  };

  /**
   * Updates the orders list in the local storage.
   *
   * @private
   */
  function _updateLocalStorage() {
    localStorage["orders"] = JSON.stringify(orders);
  }

  // Initializes the orders list.
  if (localStorage["orders"]) {
    orders = JSON.parse(localStorage["orders"]);
  }

  return self;
})();
