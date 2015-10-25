var ObjectPath = require('object-path');
var JWT = require('jsonwebtoken');
var UUID = require('node-uuid');
var HapiAuthJwt = require('hapi-auth-jwt2');
var AuthHandler = (function () {
    function AuthHandler(_server) {
        this._server = _server;
    }
    AuthHandler.prototype.registerAuth = function (next) {
        var _this = this;
        this._server.register(HapiAuthJwt, function (err) {
            if (err) {
                return next(err);
            }
            _this._server.auth.strategy('jwt', 'jwt', false, {
                key: _this._getSecret(),
                validateFunc: _this.validate,
                verifyOptions: { ignoreExpiration: true }
            });
            _this._server.auth.default('jwt');
            return next();
        });
    };
    AuthHandler.prototype.createAndAddToken = function (id, next) {
        var _this = this;
        var token = UUID.v1();
        var userModel = this._getUserModel();
        userModel.findByIdAndUpdateToken(id, token, function (err, result) {
            if (err) {
                return next(err);
            }
            return next(null, JWT.sign({ token: token }, _this._getSecret()));
        });
    };
    AuthHandler.prototype.validate = function (decoded, request, callback) {
        var token = ObjectPath.get(decoded, 'token', '');
        if (!token) {
            return callback(null, false);
        }
        var userModel = this._getUserModel();
        userModel.findByToken(token, function (err, result) {
            if (err) {
                return callback(null, false);
            }
            if (!result.isActive) {
                return callback(null, false);
            }
            return callback(null, result);
        });
    };
    AuthHandler.prototype._getUserModel = function () {
        return this._server.plugins['amma-user'].userModel;
    };
    AuthHandler.prototype._getSecret = function () {
        return ObjectPath.get(this._server.plugins, 'amma-user.config.options.authsecret', '');
    };
    return AuthHandler;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthHandler;
