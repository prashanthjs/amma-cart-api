var Async = require('async');
var RoleService = (function () {
    function RoleService(_server) {
        this._server = _server;
    }
    RoleService.prototype.onPreStart = function (server, next) {
        this._insertDefaultRoles(next);
    };
    RoleService.prototype._insertDefaultRoles = function (next) {
        var roles = this._getDefaultRoles();
        var roleModel = this._getRoleModel();
        var privilegeHandler = this._getPrivilegeHandler();
        Async.eachSeries(roles, function (role, _callback) {
            roleModel.findById(role._id, function (err, result) {
                if (err) {
                    return _callback(err);
                }
                var scopes = [];
                if (role._id === 'super_power_admin') {
                    scopes = privilegeHandler.scopes;
                }
                else {
                    scopes = privilegeHandler.getScopesForDefaultRole(role._id);
                }
                if (result) {
                    if (result._id == 'super_power_admin') {
                        result.privileges = scopes;
                        return result.save(_callback);
                    }
                    return _callback();
                }
                role.privileges = scopes;
                return roleModel.create(role, _callback);
            });
        }, function (err) {
            return next(err);
        });
    };
    RoleService.prototype._getDefaultRoles = function () {
        return this._server.plugins['amma-user'].config.options.defaultRoles;
    };
    RoleService.prototype._getRoleModel = function () {
        return this._server.plugins['amma-user'].roleModel;
    };
    RoleService.prototype._getPrivilegeHandler = function () {
        return this._server.plugins['amma-user'].privilegeHandler;
    };
    return RoleService;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoleService;
