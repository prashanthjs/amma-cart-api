import Plugin = require('amma-plugin-loader');

let pkg = require('./package.json');
let PluginLoader = Plugin.default;
let config: Plugin.IConfig = {
  attributes: {
    pkg: pkg
  }
};
let plugin:Plugin.IPluginLoader = new PluginLoader(config);
export = plugin;
