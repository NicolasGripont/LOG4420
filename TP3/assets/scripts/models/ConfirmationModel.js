"use strict";

var ConfirmationModel = function (firstName, lastName, commandId) {
  this.clientFirstName = firstName;
  this.clientLastName = lastName;
  this.commandId = commandId;
};

ConfirmationModel.prototype = {
  getClientFirstName : function() {
    return this.firstName;
  }, 
  
  getClientLastName : function() {
    return this.lastName;
  }, 

  getCommandId : function() {
    return this.commandId;
  }, 

  setClientFirstName : function(firstName) {
    this.firstName = firstName;
  }, 
  
  setClientLastName : function(lastName) {
    this.lastName = lastName;
  }, 

  setCommandId : function(commandId) {
    this.commandId = commandId;
  }
};