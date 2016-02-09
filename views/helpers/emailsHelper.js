var Handlebars = require('handlebars');
module.exports = function (emails) {

  var result = ""; 
  emails.forEach(function (email) {
    result += "<li>" + email + "</li><input name='to' type='hidden' value='" + email + "'>"; 
     
  });

  return new Handlebars.SafeString(result);
};