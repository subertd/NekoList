/**
 * Created by Donald on 6/2/2015.
 */

var secureRandom = require('secure-random');

function Sessions() {

  /**
   * Associations between userId, token, and expiration date
   *
   * @type Array[ {userId, token, expiration} ]
   */
  var sessions = [];

  var generateRandomToken = function() {
    return secureRandom(128);
  }

  return {
    'createSession': function(userId) {

      var token = generateRandomToken();

      var session = {
        userId: userId,
        token: token,
        expiration: Date.now() + 1000000
      }

      sessions.push(session);

      return session;
    },
    'verifyToken': function(userId, token) {
      sessions.forEach(function(session, index) {
        if (token.expiration > Date.now()) {
          if (session.userId == userId && token === session.token) {
            return true;
          }
        }
        else {
          sessions.splice(index, 1);
        }
      });
      return false;
    }
  };
}

module.exports = new Sessions();