var Mongoose = require("mongoose");
var ArticleModel = (function () {
    function ArticleModel(_server) {
        this._server = _server;
    }
    ArticleModel.prototype.getDbParser = function () {
        return this._server.plugins['amma-db-parser'].dbParser.getDbParser(this.getSchema());
    };
    ArticleModel.prototype.getSchema = function () {
        return this._server.plugins['amma-article'].config.options.articleSchema.schema;
    };
    ArticleModel.prototype.getCollectionName = function () {
        return this._server.plugins['amma-article'].config.options.articleSchema.collectionName;
    };
    Object.defineProperty(ArticleModel.prototype, "model", {
        get: function () {
            if (!ArticleModel._model) {
                ArticleModel._model = Mongoose.model(this.getCollectionName(), this.getSchema());
            }
            return ArticleModel._model;
        },
        enumerable: true,
        configurable: true
    });
    ArticleModel.prototype.findAll = function (options, next) {
        var dbParser = this.getDbParser();
        dbParser.parse(options);
        this.model.find(dbParser.filter).sort(dbParser.sort).limit(dbParser.pageSize).skip(dbParser.skip).exec(next);
    };
    ArticleModel.prototype.findAllCount = function (options, next) {
        var dbParser = this.getDbParser();
        dbParser.parse(options);
        this.model.count(dbParser.filter).exec(next);
    };
    ArticleModel.prototype.findById = function (id, next) {
        this.model.findById(id).exec(next);
    };
    ArticleModel.prototype.create = function (payload, next) {
        this.model.create(payload, next);
    };
    ArticleModel.prototype.findByIdAndUpdate = function (id, payload, next) {
        this.model.findByIdAndUpdate(id, payload, { upsert: false }, next);
    };
    ArticleModel.prototype.findByIdAndRemove = function (id, next) {
        this.model.findByIdAndRemove(id, next);
    };
    return ArticleModel;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArticleModel;
