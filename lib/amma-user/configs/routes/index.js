var _ = require('lodash');
var userRoutes = require('./user');
var profileRoutes = require('./profile');
var roleRoutes = require('./role');
module.exports = _.union(userRoutes, profileRoutes, roleRoutes);
