import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import CrudModel = require('../../../lib/crud.model');
import CrudController = require('../../../lib/crud.controller');
import Mongoose = require('mongoose');
import Boom = require('boom');

let lab = exports.lab = Lab.script(),
    before = lab.before,
    beforeEach = lab.beforeEach,
    afterEach = lab.afterEach,
    after = lab.after,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;

class SampleModel extends CrudModel.default<Mongoose.Document> {

    getSchema():Mongoose.Schema {
        return new Mongoose.Schema({});
    }

    getCollectionName():string {
        return 'test';
    }

}

class SampleController extends CrudController.default<Mongoose.Document, CrudModel.ICrudModel<Mongoose.Document>> {

    public service:CrudModel.ICrudModel<Mongoose.Document>;

    getService():any {
        if (!this.service) {
            this.service = new SampleModel(new Hapi.Server());
        }
        return this.service;
    }

}

suite('Test Article Controller', () => {
    let server;
    let sampleController;
    let sampleService;
    before((next) => {
        server = new Hapi.Server();
        sampleController = new SampleController(server);
        sampleService = sampleController.getService();
        next();
    });

    suite('get all', () => {
        test('on success', (next) => {
            let request = Sinon.spy();
            let response = Sinon.spy();
            let stub = Sinon.stub(sampleService, 'findAll', (options, callback) => {
                return callback(null, {});
            });
            let stubCount = Sinon.stub(sampleService, 'findAllCount', (options, callback) => {
                return callback(null, {});
            });
            sampleController.getAll(request, response);
            expect(response.called).to.be.true();
            stub.restore();
            stubCount.restore();
            return next();
        });
        test('on failure', (next) => {
            let request = Sinon.spy();
            let response = Sinon.spy();
            let stub = Sinon.stub(sampleService, 'findAll', (options, callback) => {
                return callback('error', {});
            });
            let stubCount = Sinon.stub(sampleService, 'findAllCount', (options, callback) => {
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

    suite('get', () => {
        let request, response;
        beforeEach((next) => {
            request = {
                params: {
                    id: 'test'
                }
            };
            response = Sinon.spy();
            return next();

        });
        test('on success', (next) => {
            let stub = Sinon.stub(sampleService, 'findById', (options, callback) => {
                return callback(null, {});
            });
            sampleController.get(request, response);
            expect(response.called).to.be.true();
            stub.restore();
            return next();
        });
        test('on not found', (next) => {
            let stub = Sinon.stub(sampleService, 'findById', (options, callback) => {
                return callback(null, null);
            });
            sampleController.get(request, response);
            expect(response.called).to.be.true();
            expect(response.calledWith(Boom.notFound('not found'))).to.be.true();
            stub.restore();
            return next();
        });

        test('on failure', (next) => {
            let stub = Sinon.stub(sampleService, 'findById', (options, callback) => {
                return callback('error', {});
            });
            sampleController.get(request, response);
            expect(response.called).to.be.true();
            expect(response.calledWith(Boom.badImplementation('error'))).to.be.true();
            stub.restore();
            return next();
        });
    });
    suite('create', () => {
        let request, response;
        beforeEach((next) => {
            request = {
                payload: {
                    _id: 'test'
                }
            };
            return next();
        });
        test('on success', (next) => {
            let stub = Sinon.stub(sampleService, 'create', (options, callback) => {
                return callback(null, {});
            });
            let stub2 = Sinon.stub(sampleService, 'findById', (options, callback) => {
                return callback(null, {});
            });

            let createdSpy = Sinon.spy(() => {
                expect(response.called).to.be.true();
                expect(createdSpy.called).to.be.true();
                stub.restore();
                stub2.restore();
                next();
            });
            response = Sinon.spy(() => {
                return {
                    created: createdSpy
                };
            });
            sampleController.create(request, response);
        });
        test('on forbidden error', (next) => {
            let stub = Sinon.stub(sampleService, 'create', (options, callback) => {
                return callback('forbidden');
            });
            response = Sinon.spy(() => {
                expect(response.called).to.be.true();
                expect(response.calledWith(Boom.forbidden('forbidden'))).to.be.true();
                stub.restore();
                next();
            });
            sampleController.create(request, response);
        });
        test('on error code 11000', (next) => {
            let stub = Sinon.stub(sampleService, 'create', (options, callback) => {
                return callback({code: 11000});
            });
            response = Sinon.spy(() => {
                expect(response.called).to.be.true();
                expect(response.calledWith(Boom.forbidden('id exists already'))).to.be.true();
                stub.restore();
                next();
            });
            sampleController.create(request, response);
        });
        test('on error code 11001', (next) => {
            let stub = Sinon.stub(sampleService, 'create', (options, callback) => {
                return callback({code: 11001});
            });
            response = Sinon.spy(() => {
                expect(response.called).to.be.true();
                expect(response.calledWith(Boom.forbidden('id exists already'))).to.be.true();
                stub.restore();
                next();
            });
            sampleController.create(request, response);
        });

    });
    suite('update', () => {
        let request, response;
        beforeEach((next) => {
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
        test('on success', (next) => {
            let stub = Sinon.stub(sampleService, 'findByIdAndUpdate', (_id, options, callback) => {
                return callback(null, {});
            });
            let stub2 = Sinon.stub(sampleService, 'findById', (options, callback) => {
                return callback(null, {});
            });
            response = Sinon.spy(() => {
                expect(response.called).to.be.true();
                stub.restore();
                stub2.restore();
                next();
            });
            sampleController.update(request, response);
        });
        test('on error', (next) => {
            let stub = Sinon.stub(sampleService, 'findByIdAndUpdate', (_id, options, callback) => {
                return callback('error');
            });
            response = Sinon.spy(() => {
                expect(response.called).to.be.true();
                expect(response.calledWith(Boom.badImplementation('error'))).to.be.true();
                stub.restore();
                next();
            });
            sampleController.update(request, response);
        });
        test('on not found', (next) => {
            let stub = Sinon.stub(sampleService, 'findByIdAndUpdate', (_id, options, callback) => {
                return callback(null, null);
            });
            let stub2 = Sinon.stub(sampleService, 'findById', (options, callback) => {
                return callback(null, null);
            });
            response = Sinon.spy(() => {
                expect(response.called).to.be.true();
                expect(response.calledWith(Boom.notFound('not found'))).to.be.true();
                stub.restore();
                stub2.restore();
                next();
            });
            sampleController.update(request, response);
        });

    });

    suite('remove', () => {
        let request, response;
        beforeEach((next) => {
            request = {
                params: {
                    _id: 'test'
                }
            };
            return next();
        });
        test('on success', (next) => {
            let stub = Sinon.stub(sampleService, 'findByIdAndRemove', (options, callback) => {
                return callback(null);
            });
            let codeSpy = Sinon.spy(() => {
                expect(response.called).to.be.true();
                expect(codeSpy.called).to.be.true();
                expect(codeSpy.calledWith(204)).to.be.true();
                stub.restore();
                next();
            });
            response = Sinon.spy(() => {
                return {
                    code: codeSpy
                };
            });
            sampleController.remove(request, response);
        });
        test('on error', (next) => {
            let stub = Sinon.stub(sampleService, 'findByIdAndRemove', (options, callback) => {
                return callback('error');
            });
            response = Sinon.spy(() => {
                expect(response.called).to.be.true();
                expect(response.calledWith(Boom.badRequest('error'))).to.be.true();
                stub.restore();
                next();
            });
            sampleController.remove(request, response);
        });
    });
});
