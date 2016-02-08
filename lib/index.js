var Hapi = require('hapi');
var Handlebars = require('handlebars');
var Inert = require('inert');
var Vision = require('vision');
var HapiAuthGoogle = require('hapi-auth-google');

var Assets = require('./assets.js');
var Home = require('./home.js');
var Authentication = require('./authentication.js');
var GetGoogleLoginUrl = require('./get_google_login_url.js');
var GoogleAuthHAndler = require('./google_auth_handler.js');
var Login = require('./login.js');


exports.init = function (port, next) {
  var server = new Hapi.Server();
  server.connection({port: port});

  var scopes = [
    'https://www.googleapis.com/auth/plus.profile.emails.read',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/gmail.send'
  ];

  var opts = {
    REDIRECT_URL: '/googleauth',
    scope: scopes,
    handler: GoogleAuthHAndler
  };

  var plugins = [
    {register: HapiAuthGoogle, options: opts},
    Authentication,
    Inert,
    Vision,
    Assets,
    Home,
    Login,
    GetGoogleLoginUrl
  ];

  server.register(plugins, function (err) {
    if (err) {
      next(err)
    }

    server.views({
      engines: {
        html: Handlebars
      },
      relativeTo: __dirname + '/../views/',
      path: '.',
      layout: 'default',
      layoutPath: 'layout'
    });

    server.start(function (err) {
      return next(err, server);
    });
  });
};