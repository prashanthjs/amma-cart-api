import Plugin = require('amma-plugin-loader');

let pkg = require('./package.json');
let PluginLoader = Plugin.default;
let config:Plugin.IConfig = {
    options: require('./configs/options'),
    services: require('./configs/services'),
    routes: require('./configs/routes'),
    listeners: require('./configs/listeners'),
    runs: require('./configs/runs'),
    attributes: {
        pkg: pkg
    }
};
let plugin:Plugin.IPluginLoader = new PluginLoader(config);
export = plugin;
