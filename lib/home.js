exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/',
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
            return reply.view('home', {profile: profile});
         }
        
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'Home'
};