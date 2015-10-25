var _ = require("lodash");
var ObjectPath = require('object-path');
var PrivilegeHandler = (function () {
    function PrivilegeHandler(_server) {
        this._server = _server;
        this._privileges = [];
    }
    Object.defineProperty(PrivilegeHandler.prototype, "privileges", {
        get: function () {
            var _this = this;
            if (!this._privileges.length) {
                var plugins = this._server.plugins;
                _.forEach(plugins, function (plugin, key) {
                    var privileges = ObjectPath.get(plugin, 'config.options.privileges', []);
                    _this._privileges = _.union(_this._privileges, privileges);
                });
            }
            return this._privileges;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PrivilegeHandler.prototype, "scopes", {
        get: function () {
            var scopes = [];
            var privileges = this.privileges;
            for (var i = 0; i < privileges.length; i++) {
                scopes.push(privileges[i].name);
            }
            return scopes;
        },
        enumerable: true,
        configurable: true
    });
    return PrivilegeHandler;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PrivilegeHandler;
