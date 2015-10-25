var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CrudController = require('../../amma-crud-helper/lib/crud.controller');
var ArticleController = (function (_super) {
    __extends(ArticleController, _super);
    function ArticleController() {
        _super.apply(this, arguments);
    }
    ArticleController.prototype.getService = function () {
        return this._server.plugins['amma-article'].articleModel;
    };
    return ArticleController;
})(CrudController.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArticleController;
