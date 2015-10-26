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
            _this._guestToken = _this.createGuestToken();
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
    AuthHandler.prototype.createGuestToken = function () {
        var token = 'guest';
        return JWT.sign({ token: token }, this._getSecret());
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
        var userModel = this._getUserModel();
        var roleModel = this._getRoleModel();
        if (!token) {
            callback(null, false);
        }
        else if (token === 'guest') {
            roleModel.findById('guest', function (err, result) {
                if (err) {
                    return callback(null, true);
                }
                return callback(null, { scope: result.privileges });
            });
        }
        else {
            userModel.findByToken(token, function (err, result) {
                if (err) {
                    callback(null, false);
                }
                else if (!result || !result.isActive) {
                    callback(null, false);
                }
                else {
                    roleModel.findById(result.role, function (err, result) {
                        if (!err) {
                            result.scope = result.privileges;
                        }
                        return callback(null, result);
                    });
                }
            });
        }
    };
    AuthHandler.prototype.onRequest = function (request, reply) {
        var authToken = ObjectPath.get(request.headers, 'authorization', null);
        if (!authToken) {
            ObjectPath.set(request.headers, 'authorization', this._guestToken);
        }
        reply.continue();
    };
    AuthHandler.prototype._getUserModel = function () {
        return this._server.plugins['amma-user'].userModel;
    };
    AuthHandler.prototype._getRoleModel = function () {
        return this._server.plugins['amma-user'].roleModel;
    };
    AuthHandler.prototype._getSecret = function () {
        return ObjectPath.get(this._server.plugins, 'amma-user.config.options.authsecret', '');
    };
    return AuthHandler;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthHandler;
