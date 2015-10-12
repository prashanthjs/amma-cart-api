var Mongoose = require("mongoose");
var CrudModel = (function () {
    function CrudModel(_server) {
        this._server = _server;
    }
    CrudModel.prototype.getDbParser = function () {
        return this._server.plugins['amma-db-parser'].dbParser.getDbParser(this.getSchema());
    };
    CrudModel.prototype.getSchema = function () {
        throw new Error("getSchema() method not implemented");
    };
    CrudModel.prototype.getCollectionName = function () {
        throw new Error("getCollectionName() method not implemented");
    };
    Object.defineProperty(CrudModel.prototype, "model", {
        get: function () {
            if (!this._model) {
                var names = Mongoose.modelNames();
                var collectionName = this.getCollectionName();
                if (names.indexOf(collectionName) == -1) {
                    this._model = Mongoose.model(collectionName, this.getSchema());
                }
                else {
                    this._model = Mongoose.model(collectionName);
                }
            }
            return this._model;
        },
        enumerable: true,
        configurable: true
    });
    CrudModel.prototype.findAll = function (options, next) {
        var dbParser = this.getDbParser();
        dbParser.parse(options);
        this.model.find(dbParser.filter).sort(dbParser.sort).limit(dbParser.pageSize).skip(dbParser.skip).exec(next);
    };
    CrudModel.prototype.findAllCount = function (options, next) {
        var dbParser = this.getDbParser();
        dbParser.parse(options);
        this.model.count(dbParser.filter).exec(next);
    };
    CrudModel.prototype.findById = function (id, next) {
        this.model.findById(id).exec(next);
    };
    CrudModel.prototype.create = function (payload, next) {
        this.model.create(payload, next);
    };
    CrudModel.prototype.findByIdAndUpdate = function (id, payload, next) {
        this.model.findByIdAndUpdate(id, payload, { upsert: false }, next);
    };
    CrudModel.prototype.findByIdAndRemove = function (id, next) {
        this.model.findByIdAndRemove(id, next);
    };
    return CrudModel;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CrudModel;
