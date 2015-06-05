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
        expiration: Date.now() + 10000000
      }

      sessions.push(session);

      return session;
    },
    'verifyToken': function(userId, token) {

      if (!userId || ! token) {
        return false;
      }

      for (var session in sessions) {
        if (sessions[session].expiration > Date.now()) {
          if (sessions[session].userId == userId && token === JSON.stringify(sessions[session].token)) {
            return true;
          }
        }
        else {
          sessions.splice(session, 1);
        }
      }
      return false;
    }
  };
}

module.exports = new Sessions();