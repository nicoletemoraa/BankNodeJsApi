var socket = require('socket.io');

var SocketSingleton = (function() {
  this.io = null;
  this.configure = function(server) {
    this.io = socket.listen(server);
  }

  return this;
})();

module.exports = SocketSingleton;