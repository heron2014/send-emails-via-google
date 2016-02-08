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
            return reply('sent');
         }
        
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'SendEmail'
};