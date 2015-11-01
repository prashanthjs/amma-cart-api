var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CrudController = require('../../amma-crud-helper/lib/crud.controller');
var RoleController = (function (_super) {
    __extends(RoleController, _super);
    function RoleController() {
        _super.apply(this, arguments);
    }
    RoleController.prototype.getService = function () {
        return this._server.plugins['amma-user'].roleModel;
    };
    return RoleController;
})(CrudController.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoleController;
