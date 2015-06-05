/**
 * Created by Donald on 5/25/2015.
 */
function PasswordHasher() {

  var bcrypt = require('bcrypt-nodejs');

  var saltWorkFactor = 10;

  return {
    hashPassword: function(password, callback) {

      if (!password) {
        callback("Missing Password");
        return;
      }

      bcrypt.genSalt(saltWorkFactor, function(err, salt) {
        if (err) {
          callback(err, salt);
          return;
        }

        bcrypt.hash(password, salt, null, function(err, hash) {
          callback(err, hash);
        });
      });
    },
    comparePasswordToHash: function(password, passwordHash, callback) {

      bcrypt.compare(password, passwordHash, function(err, success) {
        callback(err, success);
      });
    }
  };
}

module.exports = new PasswordHasher();