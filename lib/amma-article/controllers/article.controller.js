var Boom = require("boom");
var Async = require('async');
var ArticleController = (function () {
    function ArticleController(_server) {
        this._server = _server;
    }
    ArticleController.prototype.getService = function () {
        return this._server.plugins['amma-article'].articleModel;
    };
    ArticleController.prototype.getAll = function (request, reply) {
        var service = this.getService();
        var options = request.query;
        Async.parallel({
            results: function (callback) {
                service.findAll(request.query, callback);
            },
            total: function (callback) {
                service.findAllCount(request.query, callback);
            }
        }, function (err, results) {
            if (err) {
                return reply(Boom.badImplementation(err));
            }
            else {
                var res = {
                    results: results.results,
                    meta: {
                        total: results.total
                    }
                };
                return reply(res);
            }
        });
    };
    ArticleController.prototype.get = function (request, reply) {
        var _id = request.params.id;
        var service = this.getService();
        Async.parallel({
            results: function (callback) {
                service.findById(_id, callback);
            }
        }, function (err, results) {
            if (err) {
                reply(Boom.badImplementation(err));
            }
            else if (!results.results) {
                reply(Boom.notFound('not found'));
            }
            else {
                reply(results.results);
            }
        });
    };
    ArticleController.prototype.create = function (request, reply) {
        var service = this.getService();
        Async.series({
            save: function (callback) {
                service.create(request.payload, callback);
            },
            results: function (callback) {
                service.findById(request.payload._id, callback);
            }
        }, function (err, results) {
            if (err) {
                if (11000 === err.code || 11001 === err.code) {
                    return reply(Boom.forbidden('id exists already'));
                }
                else {
                    return reply(Boom.forbidden(err));
                }
            }
            else {
                return reply(results.results).created('/articles/' + request.payload._id);
            }
        });
    };
    ArticleController.prototype.update = function (request, reply) {
        var service = this.getService();
        var _id = request.params.id;
        var payload = request.payload;
        payload._id = _id;
        Async.series({
            save: function (callback) {
                return service.findByIdAndUpdate(_id, payload, callback);
            },
            results: function (callback) {
                return service.findById(_id, callback);
            }
        }, function (err, results) {
            if (err) {
                return reply(Boom.badImplementation(err));
            }
            else if (!results.results) {
                reply(Boom.notFound('not found'));
            }
            else {
                return reply(results.results);
            }
        });
    };
    ArticleController.prototype.remove = function (request, reply) {
        var service = this.getService();
        var _id = request.params.id;
        Async.series({
            results: function (callback) {
                return service.findByIdAndRemove(_id, callback);
            }
        }, function (err, results) {
            if (err) {
                return reply(Boom.badRequest(err));
            }
            else {
                return reply({}).code(204);
            }
        });
    };
    return ArticleController;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArticleController;
