import Glue = require('glue');
import Hapi = require('hapi');
var options = {
  relativeTo: __dirname
};
Glue.compose(require('./config/manifest'), options, function(err: any, server: Hapi.Server) {
  server.start(function(err) {
    if (err) {
      throw err;
    }
    server.start(function() {
      server.log('info', 'server started');
    });
  });
});
