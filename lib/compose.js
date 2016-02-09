exports.register = function (server, options, next) {

  server.route({
    method: 'POST',
    path: '/compose',
    config: {
      description: 'redirect to compose an email page',
      auth: {
        mode: 'try',
        strategy: 'jwt'
      },
      handler: function (request, reply) {
         if (!request.auth.isAuthenticated) {
          return reply.redirect('login');
         } else {
            
            var emailList = request.payload.emailsL;
            var emails = [];

            if (typeof emailList === 'string') {
              emails.push(emailList);
            } else {
              emails = emailList;
            }

            console.log('compose emails', emails);
            var profile = {};
            profile.myId = request.auth.credentials.id;
            profile.firstname = request.auth.credentials.name.givenName;
            profile.image = request.auth.credentials.image.url;
            profile.email = request.auth.credentials.emails[0].value;

            return reply.view('compose', {emails: emails, profile: profile});
                      
         }
         
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'Compose'
};