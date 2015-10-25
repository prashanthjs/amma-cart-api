var Plugin = require('amma-plugin-loader');
var pkg = require('./package.json');
var PluginLoader = Plugin.default;
var config = {
    options: require('./configs/options'),
    services: require('./configs/services'),
    routes: require('./configs/routes'),
    attributes: {
        pkg: pkg
    }
};
var plugin = new PluginLoader(config);
module.exports = plugin;
