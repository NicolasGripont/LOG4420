"use strict";

function OrderController(model, view, messages, headerController) {
  this._model = model;
  this._view = view;
  this._messages = messages;
  this._headerController = headerController;
  var _this = this;


  this._view.submitFormEvent.attach(function (sender, args) {
      _this.validateFields(args);
  });

}

OrderController.prototype = {
	validateFields : function (fieldsForm) {
		console.log(fieldsForm);

		jQuery.validator.addMethod("creditcardexpiry", function(value, element) {
			return this.optional(element) || /^(0[1-9]|1[012])[- \/.]\d\d$/.test(value);
		});

		fieldsForm.validate({
			rules : {
				"first-name" : {
					required : true,
					minLength : 2
				},
				"last-name" : {
					required : true,
					minLength : 2
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
					required : "Ce champ est obligatoire.",
					minLength : "Veuillez saisir au moins 2 caractères."
				},
				"last-name" : {
					required : "Ce champ est obligatoire",
					minLength : "Veuillez saisir au moins 2 caractères."
				},
				"email" : {
					required : "Ce champ est obligatoire",
					email : "L'email saisi n'est pas au bon format."
				},
				"phone" : {
					required : "Ce champ est obligatoire",
					phoneUS : "Le numéro de téléphone doit être un numéro de téléphone canadien valide"
				},
				"credit-card" : {
					required : "Ce champ est obligatoire",
					creditcard : "Veuillez saisir un numéro de carte valide au format VISA"
				},
				"credit-card-expiry" : {
					required : "Ce champ est obligatoire",
					creditcardexpiry : "La date d'expiration de votre carte de crédit est invalide."
				}
			}
		})
	}
}
