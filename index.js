var Glue = require('glue');
var options = {
    relativeTo: __dirname
};
Glue.compose(require('./config/manifest'), options, function (err, server) {
    server.start(function (err) {
        if (err) {
            throw err;
        }
        server.start(function () {
            server.log('info', 'server started');
        });
    });
});
