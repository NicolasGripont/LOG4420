"use strict";

var OrderModel = function (firstName, lastName, commandId) {
  this.clientFirstName = firstName;
  this.clientLastName = lastName;
  this.commandId = commandId;
};

OrderModel.prototype = {
  getClientFirstName : function() {
    return this.firstName;
  }
};