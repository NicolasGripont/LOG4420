"use strict";

function OrderController(model, view, messages, headerController, shoppingCartController) {
  this._model = model;
  this._view = view;
  this._messages = messages;
  this._headerController = headerController;
  this._shoppingCartController = shoppingCartController;
  var _this = this;

  if(this._view) {
    this._view.submitFormEvent.attach(function (sender, args) {
        _this.validateFields(args);
    });
  }
};

OrderController.prototype = {
  validateFields : function (fieldsForm) {
    var self = this;
    // Eviter d'avoir un nom avec un chiffre par exemple
    jQuery.validator.addMethod("nameregex", function(value, element) {
      return this.optional(element) || /^([A-zÀ-ÿ -]{2,30})$/.test(value);
    });

    jQuery.validator.addMethod("creditcardexpiry", function(value, element) {
      return this.optional(element) || /^(0[1-9]|1[012])[- \/.]\d\d$/.test(value);
    });

    fieldsForm.validate({
      rules : {
        "first-name" : {
          required : true,
          minlength : 2,
          nameregex : true
        },
        "last-name" : {
          required : true,
          minlength : 2,
          nameregex : true
        },
        "email" : {
          required : true,
          email : true
        },
        "phone" : {
          required : true,
          phoneUS : true
        },
        "credit-card" : {
          required : true,
          creditcard : true
        },
        "credit-card-expiry" : {
          required : true,
          creditcardexpiry : true
        }
      },
      messages : {
        "first-name" : {
          required : this._messages.fieldRequired,
          minlength : this._messages.minLengthNamesField,
          nameregex : this._messages.goodFormatNamesField
        },
        "last-name" : {
          required : this._messages.fieldRequired,
          minlength : this._messages.minLengthNamesField,
          nameregex : this._messages.goodFormatNamesField
        },
        "email" : {
          required : this._messages.fieldRequired,
          email : this._messages.badEmailFormat
        },
        "phone" : {
          required : this._messages.fieldRequired,
          phoneUS : this._messages.badPhoneFormat
        },
        "credit-card" : {
          required : this._messages.fieldRequired,
          creditcard : this._messages.badCreditCardFormat
        },
        "credit-card-expiry" : {
          required : this._messages.fieldRequired,
          creditcardexpiry : this._messages.badExpirationDate
        }
      }
    });
    // if(fieldsForm.valid()){
    //   self._shoppingCartController.removeAllProducts();
    //   self.createCommand();
    //   fieldsForm.submit();
    // }
  },

  createCommand : function () {
    var firstName = $('#first-name').val();
    var lastName = $('#last-name').val();
    var commandId = this.determineLastCommandId() + 1;
    localStorage.setItem("firstName",firstName);
    localStorage.setItem("lastName",lastName);
    localStorage.setItem("numberOfCommandDone",commandId);
  },

  determineLastCommandId : function() {
    var test = localStorage.getItem("numberOfCommandDone");
    if(test) {
      return parseInt(test);
    }
    return 0;
  }
};
