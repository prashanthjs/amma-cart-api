var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CrudModel = require('../../amma-crud-helper/lib/crud.model');
var Bcrypt = require('bcrypt');
var UserModel = (function (_super) {
    __extends(UserModel, _super);
    function UserModel() {
        _super.apply(this, arguments);
    }
    UserModel.prototype.getSchema = function () {
        return this._server.plugins['amma-user'].config.options.userSchema.schema;
    };
    UserModel.prototype.getCollectionName = function () {
        return this._server.plugins['amma-user'].config.options.userSchema.collectionName;
    };
    UserModel.prototype.findByToken = function (token, next) {
        this.model.findOne({ token: token }).exec(next);
    };
    UserModel.prototype.findByIdAndUpdateToken = function (id, token, next) {
        this.findById(id, function (err, result) {
            if (err) {
                next(err);
            }
            else if (result) {
                if (!result.token) {
                    result.token = [];
                }
                result.token.push(token);
                result.save(next);
            }
            else {
                next();
            }
        });
    };
    UserModel.prototype.findByTokenAndRemove = function (token, next) {
        this.findByToken(token, function (err, result) {
            if (err) {
                next('User not found');
            }
            result.token.pull(token);
            result.save(next);
        });
    };
    UserModel.prototype.create = function (payload, next) {
        var _this = this;
        Bcrypt.hash(payload.password, this._getHash(), function (err, hash) {
            if (err) {
                next(err);
            }
            else {
                payload.password = hash;
                _super.prototype.create.call(_this, payload, next);
            }
        });
    };
    UserModel.prototype.canLogin = function (id, password, callback) {
        this.model.findById(id).select('+password').exec(function (err, result) {
            if (err) {
                callback(err);
            }
            else if (!result) {
                callback('user not found');
            }
            else if (!result.isActive) {
                return callback('user not active');
            }
            else {
                Bcrypt.compare(password, result.password, function (err, res) {
                    if (err) {
                        callback(err);
                    }
                    else if (!res) {
                        callback('invalid credentials');
                    }
                    else {
                        callback(null, result);
                    }
                });
            }
        });
    };
    UserModel.prototype.findByIdAndUpdatePassword = function (id, password, next) {
        var _this = this;
        this.findById(id, function (err, result) {
            if (err || !result) {
                next('User not found');
            }
            Bcrypt.hash(password, _this._getHash(), function (err, hash) {
                if (err) {
                    next(err);
                }
                else {
                    result.password = hash;
                    result.save(next);
                }
            });
        });
    };
    UserModel.prototype._getHash = function () {
        return this._server.plugins['amma-user'].config.options.hash;
    };
    return UserModel;
})(CrudModel.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserModel;
