import _ = require('lodash');
let userRoutes = require('./user');
let profileRoutes = require('./profile');
let roleRoutes = require('./role');
module.exports = _.union(userRoutes, profileRoutes, roleRoutes);
