var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CrudModel = require('../../amma-crud-helper/lib/crud.model');
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
                next('User not found');
            }
            result.token.push(token);
            result.save(next);
        });
    };
    UserModel.prototype.findByTokenAndRemoveToken = function (token, next) {
        this.findByToken(token, function (err, result) {
            if (err) {
                next('User not found');
            }
            result.token.pull(token);
            result.save(next);
        });
    };
    return UserModel;
})(CrudModel.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserModel;
