import Plugin = require('amma-plugin-loader');

let pkg = require('./package.json');
let PluginLoader = Plugin.default;
let config: Plugin.IConfig = {
  options:{
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
let plugin:Plugin.IPluginLoader = new PluginLoader(config);
export = plugin;
