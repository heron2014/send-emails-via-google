exports.register = function (server, option, next) {

  server.route([
    {
      method: 'GET',
      path: '/getgoogleloginurl',
      config: {
        description: 'return a google url',
        auth: false,
        handler: function (request, reply) {
          
          var url = server.generate_google_oauth2_url();
          
          return reply(url);
        }
      }
    }
  ]);
  return next();
}

exports.register.attributes = {
  name: 'GetGoogleLoginUrl'
}