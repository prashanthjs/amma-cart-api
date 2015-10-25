var Boom = require("boom");
var Async = require('async');
var CrudController = (function () {
    function CrudController(_server) {
        this._server = _server;
    }
    CrudController.prototype.getAll = function (request, reply) {
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
    CrudController.prototype.get = function (request, reply) {
        var _id = request.params.id;
        var service = this.getService();
        service.findById(_id, function (err, result) {
            if (err) {
                reply(Boom.badImplementation(err));
            }
            else if (!result) {
                reply(Boom.notFound('not found'));
            }
            else {
                reply(result);
            }
        });
    };
    CrudController.prototype.create = function (request, reply) {
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
                return reply(results.results).created(request.payload._id);
            }
        });
    };
    CrudController.prototype.update = function (request, reply) {
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
    CrudController.prototype.remove = function (request, reply) {
        var service = this.getService();
        var _id = request.params.id;
        service.findByIdAndRemove(_id, function (err, results) {
            if (err) {
                return reply(Boom.badRequest(err));
            }
            else {
                return reply({ 'success': true });
            }
        });
    };
    return CrudController;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CrudController;
