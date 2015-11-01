import Glue = require('glue');
import Hapi = require('hapi');
var options = {
    relativeTo: __dirname
};
function initialise(next) {
    Glue.compose(require('./manifest'), options, function (err:any, server:Hapi.Server) {
        if (err) {
            console.log(err);
        }
        next(server);
    });
}
module.exports = initialise;
