var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CrudModel = require('../../amma-crud-helper/lib/crud.model');
var ArticleModel = (function (_super) {
    __extends(ArticleModel, _super);
    function ArticleModel() {
        _super.apply(this, arguments);
    }
    ArticleModel.prototype.getSchema = function () {
        return this._server.plugins['amma-article'].config.options.articleSchema.schema;
    };
    ArticleModel.prototype.getCollectionName = function () {
        return this._server.plugins['amma-article'].config.options.articleSchema.collectionName;
    };
    return ArticleModel;
})(CrudModel.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArticleModel;
