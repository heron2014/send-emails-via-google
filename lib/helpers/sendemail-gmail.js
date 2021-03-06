var google       = require('googleapis');
var gmail        = google.gmail('v1');
var OAuth2       = google.auth.OAuth2;
var oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
var btoa         = require('btoa'); // encode email string to base64
var Handlebars   = require('handlebars');
/**
 * sendEmail abstracts the complexity of sending an email via the GMail API
 * @param {Object} options - the options for your email, these include:
 *  - credentials
 *    - {Object} auth - the list of tokens returned after Google OAuth
 *    - {Array} emails - the current user's email addresses (List)
 *  - {String} to - the recipient of the email
 *  - {String} from - sender address
 *  - {String} message - the message you want to send
 * @param {Function} callback - gets called once the message has been sent
 *   your callback should accept two arguments:
 *   @arg {Object} error - the error returned by the GMail API
 *   @arg {Object} response - response sent by GMail API
 */
module.exports = function sendEmail(options, callback) {
  var template = Handlebars.compile(options.payload.message);
  var message  = template(options.payload);
  // console.log('Message ', message);
  // console.log('options', options);
  var credentials = options.auth.credentials; // see:
  oauth2Client.setCredentials(credentials.tokens);
  // console.log('Emails', credentials);
  var email    = credentials.emails[0].value;
  var name     = credentials.name.givenName;
  // console.log(' - - - - - - - - - request.auth.credentials - - - - - - - - - - ');
  // console.log(JSON.stringify(options.auth.credentials));
  var base64EncodedEmail = btoa( // encode email "envelope"
        "Content-Type:  text/html; charset=\"UTF-8\"\n" +
        "Content-length: 5000\n" +
        "Content-Transfer-Encoding: message/rfc2822\n" +
        "to: " + options.payload.to + "\n" +
        "from: \"" + name + "\" <"+ email +">\n" +
        //  "from: nodecoder@gmail.com \n" +
        "subject:" + options.payload.subject + "\n\n" +
        // "This message was sent by <b>Node.js</b>!"
        '<table width="auto"> <tr><td>' +
        message +
        '</td> </tr></table>'
          ).replace(/\+/g, '-').replace(/\//g, '_');
  // see: http://stackoverflow.com/questions/30590988/failed-sending-mail-through-google-api-with-javascript
  var params = { userId: 'me', auth: oauth2Client, resource: { //  mested object
    raw: base64EncodedEmail
  }};
  return gmail.users.messages.send(params, callback);
}