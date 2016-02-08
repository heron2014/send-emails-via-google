require('env2')('.env');
var redisClient = require('redis-connection')();

module.exports = function (decoded, request, callback) {
  
  // do your checks to see if the session is valid
  redisClient.get(decoded.id, function (rediserror, reply) {
    /* istanbul ignore if */
      // $lab:coverage:off$
    if(rediserror) {
      console.log(rediserror);
    }
    // $lab:coverage:on$
    var session;
    if(reply) {
      session = JSON.parse(reply);
    }
    else { // unable to find session in redis ... reply is null
      return callback(rediserror, false);
    }

    if (session.valid === true) {
      return callback(rediserror, true);
    }
    else {
      return callback(rediserror, false);
    }
  });
};

module.exports.redisClient = redisClient;