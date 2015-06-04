var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    usersURL:server_ip_address + ":" + server_port + "/users",
    listsURL:server_ip_address + ":" + server_port + "/lists"
  }));
});

module.exports = router;
