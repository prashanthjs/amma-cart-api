var Plugin = require('amma-plugin-loader');
var pkg = require('./package.json');
var PluginLoader = Plugin.default;
var config = {
    options: {
        'articleSchema': require('./services/article.schema').default
    },
    services: {
        'articleModel': require('./services/article.model').default,
        'articleController': require('./controllers/article.controller').default
    },
    routes: require('./routes').default,
    attributes: {
        pkg: pkg
    }
};
var plugin = new PluginLoader(config);
module.exports = plugin;
