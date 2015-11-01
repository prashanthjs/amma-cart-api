var Glue = require('glue');
var options = {
    relativeTo: __dirname
};
function initialise(next) {
    Glue.compose(require('./manifest'), options, function (err, server) {
        if (err) {
            console.log(err);
        }
        next(server);
    });
}
module.exports = initialise;
