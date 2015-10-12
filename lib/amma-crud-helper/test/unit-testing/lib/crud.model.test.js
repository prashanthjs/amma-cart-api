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
var Mongoose = require('mongoose');
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
suite('Test Article Service', function () {
    var server;
    var modelService;
    var dbParserStub;
    before(function (next) {
        server = new Hapi.Server();
        modelService = new SampleModel(server);
        server.plugins = {
            'amma-db-parser': {
                dbParser: {
                    getDbParser: function () {
                        return {
                            parse: function () { },
                            filter: {},
                            sort: {},
                            pageSize: 10,
                            skip: 0
                        };
                    }
                }
            }
        };
        next();
    });
    test('find all', function (next) {
        var spy = Sinon.spy();
        var query = {
            sort: function () {
                return this;
            },
            skip: function () {
                return this;
            },
            limit: function () {
                return this;
            },
            exec: spy
        };
        var stub = Sinon.stub(modelService.model, 'find', function () {
            return query;
        });
        modelService.findAll();
        stub.restore();
        expect(spy.called).to.be.true();
        return next();
    });
    test('find all count', function (next) {
        var spy = Sinon.spy();
        var query = {
            exec: spy
        };
        var stub = Sinon.stub(modelService.model, 'count', function () {
            return query;
        });
        modelService.findAllCount();
        stub.restore();
        expect(spy.called).to.be.true();
        return next();
    });
    test('find by id', function (next) {
        var spy = Sinon.spy();
        var query = {
            exec: spy
        };
        var stub = Sinon.stub(modelService.model, 'findById', function () {
            return query;
        });
        modelService.findById('test');
        stub.restore();
        expect(spy.called).to.be.true();
        return next();
    });
    test('create', function (next) {
        var spy = Sinon.spy();
        var stub = Sinon.stub(modelService.model, 'create').callsArgWith(1, null, {});
        modelService.create({}, spy);
        stub.restore();
        expect(spy.called).to.be.true();
        return next();
    });
    test('find by id and update', function (next) {
        var stub = Sinon.stub(modelService.model, 'findByIdAndUpdate').callsArgWith(3, null, {});
        var spy = Sinon.spy();
        modelService.findByIdAndUpdate('test', {}, spy);
        stub.restore();
        expect(spy.called).to.be.true();
        return next();
    });
    test('find by id and remove', function (next) {
        var stub = Sinon.stub(modelService.model, 'findByIdAndRemove').callsArgWith(1, null, {});
        var spy = Sinon.spy();
        modelService.findByIdAndRemove('test', spy);
        stub.restore();
        expect(spy.called).to.be.true();
        return next();
    });
});
