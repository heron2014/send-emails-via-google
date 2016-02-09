exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/compose',
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
            var profile = {};
            profile.myId = request.auth.credentials.id;
            profile.firstname = request.auth.credentials.name.givenName;
            profile.image = request.auth.credentials.image.url;
            profile.email = request.auth.credentials.emails[0].value;
            console.log('-----Profile-----', profile);
            return reply.view('compose', {profile: profile});
         }
        
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'Compose'
};