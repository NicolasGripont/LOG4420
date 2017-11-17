var validator = require('validator');
var s = "514-340-4711";
var str = s.replace(/-/g,'');
console.log(str);
if(!validator.isMobilePhone(("514-340-4711".replace('-','')), "en-CA")){
  console.log("Le paramètre 'phone' doit être un numéro de téléphone valide.");
} else {
  console.log('OK');
}
