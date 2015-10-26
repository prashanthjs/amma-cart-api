var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CrudModel = require('../../amma-crud-helper/lib/crud.model');
var RoleModel = (function (_super) {
    __extends(RoleModel, _super);
    function RoleModel() {
        _super.apply(this, arguments);
    }
    RoleModel.prototype.getSchema = function () {
        return this._server.plugins['amma-user'].config.options.roleSchema.schema;
    };
    RoleModel.prototype.getCollectionName = function () {
        return this._server.plugins['amma-user'].config.options.roleSchema.collectionName;
    };
    return RoleModel;
})(CrudModel.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoleModel;
