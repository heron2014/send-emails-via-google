var sendemail = require('./helpers/sendemail-gmail.js');

exports.register = function (server, options, next) {

  server.route({
    method: 'POST',
    path: '/sendemail',
    config: {
      description: 'return home page',
      auth: {
        mode: 'try',
        strategy: 'jwt'
      },
      handler: function (request, reply) {
         if (!request.auth.isAuthenticated) {
          return reply.redirect('login');
         } else {
            console.log(request.payload);
            sendemail(request, function (err, response) {
              if (err) {
                console.log(err);
              }

              console.log('response from sent', response);
              return reply('<pre><code>'+JSON.stringify(response, null, 2)+'</code></pre>');
            });            
         }
        
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'SendEmail'
};