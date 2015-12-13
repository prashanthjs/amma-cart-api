var Async = require('async');
var UserService = (function () {
    function UserService(_server) {
        this._server = _server;
    }
    UserService.prototype.onPreStart = function (server, next) {
        this._insertDefaultUsers(next);
    };
    UserService.prototype._insertDefaultUsers = function (next) {
        var users = this._getDefaultUsers();
        var userModel = this._getUserModel();
        Async.eachSeries(users, function (user, _callback) {
            userModel.findById(user._id, function (err, userDoc) {
                if (err || userDoc) {
                    _callback(err);
                }
                else {
                    userModel.create(user, _callback);
                }
            });
        }, function (err) {
            return next(err);
        });
    };
    UserService.prototype._getUserModel = function () {
        return this._server.plugins['amma-user'].userModel;
    };
    UserService.prototype._getDefaultUsers = function () {
        return this._server.plugins['amma-user'].config.options.defaultUsers;
    };
    return UserService;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserService;
