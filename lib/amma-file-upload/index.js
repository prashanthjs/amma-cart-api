var Plugin = require('amma-plugin-loader');
var pkg = require('./package.json');
var PluginLoader = Plugin.default;
var config = {
    services: {
        'fileUpload': require('./services/file-upload').default,
        'fileUploadHelper': require('./services/file-upload-helper').default
    },
    attributes: {
        pkg: pkg
    },
};
var plugin = new PluginLoader(config);
module.exports = plugin;
