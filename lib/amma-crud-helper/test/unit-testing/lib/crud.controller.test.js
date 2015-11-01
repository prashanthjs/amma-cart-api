var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var CrudModel = require('../../../lib/crud.model');
var CrudController = require('../../../lib/crud.controller');
var Mongoose = require('mongoose');
var Boom = require('boom');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
var SampleModel = (function (_super) {
    __extends(SampleModel, _super);
    function SampleModel() {
        _super.apply(this, arguments);
    }
    SampleModel.prototype.getSchema = function () {
        return new Mongoose.Schema({});
    };
    SampleModel.prototype.getCollectionName = function () {
        return 'test';
    };
    return SampleModel;
})(CrudModel.default);
var SampleController = (function (_super) {
    __extends(SampleController, _super);
    function SampleController() {
        _super.apply(this, arguments);
    }
    SampleController.prototype.getService = function () {
        if (!this.service) {
            this.service = new SampleModel(new Hapi.Server());
        }
        return this.service;
    };
    return SampleController;
})(CrudController.default);
suite('Test Article Controller', function () {
    var server;
    var sampleController;
    var sampleService;
    before(function (next) {
        server = new Hapi.Server();
        sampleController = new SampleController(server);
        sampleService = sampleController.getService();
        next();
    });
    suite('get all', function () {
        test('on success', function (next) {
            var request = Sinon.spy();
            var response = Sinon.spy();
            var stub = Sinon.stub(sampleService, 'findAll', function (options, callback) {
                return callback(null, {});
            });
            var stubCount = Sinon.stub(sampleService, 'findAllCount', function (options, callback) {
                return callback(null, {});
            });
            sampleController.getAll(request, response);
            expect(response.called).to.be.true();
            stub.restore();
            stubCount.restore();
            return next();
        });
        test('on failure', function (next) {
            var request = Sinon.spy();
            var response = Sinon.spy();
            var stub = Sinon.stub(sampleService, 'findAll', function (options, callback) {
                return callback('error', {});
            });
            var stubCount = Sinon.stub(sampleService, 'findAllCount', function (options, callback) {
                return callback(null, {});
            });
            sampleController.getAll(request, response);
            expect(response.called).to.be.true();
            expect(response.calledWith(Boom.badImplementation('error'))).to.be.true();
            stub.restore();
            stubCount.restore();
            return next();
        });
    });
    suite('get', function () {
        var request, response;
        beforeEach(function (next) {
            request = {
                params: {
                    id: 'test'
                }
            };
            response = Sinon.spy();
            return next();
        });
        test('on success', function (next) {
            var stub = Sinon.stub(sampleService, 'findById', function (options, callback) {
                return callback(null, {});
            });
            sampleController.get(request, response);
            expect(response.called).to.be.true();
            stub.restore();
            return next();
        });
        test('on not found', function (next) {
            var stub = Sinon.stub(sampleService, 'findById', function (options, callback) {
                return callback(null, null);
            });
            sampleController.get(request, response);
            expect(response.called).to.be.true();
            expect(response.calledWith(Boom.notFound('not found'))).to.be.true();
            stub.restore();
            return next();
        });
        test('on failure', function (next) {
            var stub = Sinon.stub(sampleService, 'findById', function (options, callback) {
                return callback('error', {});
            });
            sampleController.get(request, response);
            expect(response.called).to.be.true();
            expect(response.calledWith(Boom.badImplementation('error'))).to.be.true();
            stub.restore();
            return next();
        });
    });
    suite('create', function () {
        var request, response;
        beforeEach(function (next) {
            request = {
                payload: {
                    _id: 'test'
                }
            };
            return next();
        });
        test('on success', function (next) {
            var stub = Sinon.stub(sampleService, 'create', function (options, callback) {
                return callback(null, {});
            });
            var stub2 = Sinon.stub(sampleService, 'findById', function (options, callback) {
                return callback(null, {});
            });
            var createdSpy = Sinon.spy(function () {
                expect(response.called).to.be.true();
                expect(createdSpy.called).to.be.true();
                stub.restore();
                stub2.restore();
                next();
            });
            response = Sinon.spy(function () {
                return {
                    created: createdSpy
                };
            });
            sampleController.create(request, response);
        });
        test('on forbidden error', function (next) {
            var stub = Sinon.stub(sampleService, 'create', function (options, callback) {
                return callback('forbidden');
            });
            response = Sinon.spy(function () {
                expect(response.called).to.be.true();
                expect(response.calledWith(Boom.forbidden('forbidden'))).to.be.true();
                stub.restore();
                next();
            });
            sampleController.create(request, response);
        });
        test('on error code 11000', function (next) {
            var stub = Sinon.stub(sampleService, 'create', function (options, callback) {
                return callback({ code: 11000 });
            });
            response = Sinon.spy(function () {
                expect(response.called).to.be.true();
                expect(response.calledWith(Boom.forbidden('id exists already'))).to.be.true();
                stub.restore();
                next();
            });
            sampleController.create(request, response);
        });
        test('on error code 11001', function (next) {
            var stub = Sinon.stub(sampleService, 'create', function (options, callback) {
                return callback({ code: 11001 });
            });
            response = Sinon.spy(function () {
                expect(response.called).to.be.true();
                expect(response.calledWith(Boom.forbidden('id exists already'))).to.be.true();
                stub.restore();
                next();
            });
            sampleController.create(request, response);
        });
    });
    suite('update', function () {
        var request, response;
        beforeEach(function (next) {
            request = {
                payload: {
                    _id: 'test'
                },
                params: {
                    _id: 'test'
                }
            };
            return next();
        });
        test('on success', function (next) {
            var stub = Sinon.stub(sampleService, 'findByIdAndUpdate', function (_id, options, callback) {
                return callback(null, {});
            });
            var stub2 = Sinon.stub(sampleService, 'findById', function (options, callback) {
                return callback(null, {});
            });
            response = Sinon.spy(function () {
                expect(response.called).to.be.true();
                stub.restore();
                stub2.restore();
                next();
            });
            sampleController.update(request, response);
        });
        test('on error', function (next) {
            var stub = Sinon.stub(sampleService, 'findByIdAndUpdate', function (_id, options, callback) {
                return callback('error');
            });
            response = Sinon.spy(function () {
                expect(response.called).to.be.true();
                expect(response.calledWith(Boom.badImplementation('error'))).to.be.true();
                stub.restore();
                next();
            });
            sampleController.update(request, response);
        });
        test('on not found', function (next) {
            var stub = Sinon.stub(sampleService, 'findByIdAndUpdate', function (_id, options, callback) {
                return callback(null, null);
            });
            var stub2 = Sinon.stub(sampleService, 'findById', function (options, callback) {
                return callback(null, null);
            });
            response = Sinon.spy(function () {
                expect(response.called).to.be.true();
                expect(response.calledWith(Boom.notFound('not found'))).to.be.true();
                stub.restore();
                stub2.restore();
                next();
            });
            sampleController.update(request, response);
        });
    });
    suite('remove', function () {
        var request, response;
        beforeEach(function (next) {
            request = {
                params: {
                    _id: 'test'
                }
            };
            return next();
        });
        test('on success', function (next) {
            var stub = Sinon.stub(sampleService, 'findByIdAndRemove', function (options, callback) {
                return callback(null);
            });
            var codeSpy = Sinon.spy(function () {
                expect(response.called).to.be.true();
                expect(codeSpy.called).to.be.true();
                expect(codeSpy.calledWith(204)).to.be.true();
                stub.restore();
                next();
            });
            response = Sinon.spy(function () {
                return {
                    code: codeSpy
                };
            });
            sampleController.remove(request, response);
        });
        test('on error', function (next) {
            var stub = Sinon.stub(sampleService, 'findByIdAndRemove', function (options, callback) {
                return callback('error');
            });
            response = Sinon.spy(function () {
                expect(response.called).to.be.true();
                expect(response.calledWith(Boom.badRequest('error'))).to.be.true();
                stub.restore();
                next();
            });
            sampleController.remove(request, response);
        });
    });
});
