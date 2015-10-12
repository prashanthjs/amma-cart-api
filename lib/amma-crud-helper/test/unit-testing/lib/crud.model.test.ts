import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import CrudModel = require('../../../lib/crud.model');
import Mongoose = require('mongoose');

let lab = exports.lab = Lab.script(),
  before = lab.before,
  beforeEach = lab.beforeEach,
  afterEach = lab.afterEach,
  after = lab.after,
  expect = Code.expect,
  suite = lab.suite,
  test = lab.test;

class SampleModel extends CrudModel.default<Mongoose.Document> {

  getSchema(): Mongoose.Schema {
    return new Mongoose.Schema({});
  }

  getCollectionName(): string {
    return 'test';
  }

}

suite('Test Article Service', () => {
  let server;
  let modelService;
  let dbParserStub;
  before((next) => {
    server = new Hapi.Server();
    modelService = new SampleModel(server);
    server.plugins = {
      'amma-db-parser': {
        dbParser: {
          getDbParser: () => {
            return {
              parse: () => { },
              filter: {},
              sort: {},
              pageSize: 10,
              skip: 0
            };
          }
        }
      }
    }
    next();
  });

  test('find all', (next) => {
    let spy = Sinon.spy();
    let query = {
      sort: function() {
        return this;
      },
      skip: function() {
        return this;
      },
      limit: function() {
        return this;
      },
      exec: spy
    };
    let stub = Sinon.stub(modelService.model, 'find', () => {
      return query;
    });

    modelService.findAll();
    stub.restore();
    expect(spy.called).to.be.true();
    return next();
  });
  test('find all count', (next) => {
    let spy = Sinon.spy();
    let query = {
      exec: spy
    };
    let stub = Sinon.stub(modelService.model, 'count', () => {
      return query;
    });

    modelService.findAllCount();
    stub.restore();
    expect(spy.called).to.be.true();
    return next();
  });
  test('find by id', (next) => {
    let spy = Sinon.spy();
    let query = {
      exec: spy
    };
    let stub = Sinon.stub(modelService.model, 'findById', () => {
      return query;
    });
    modelService.findById('test');
    stub.restore();
    expect(spy.called).to.be.true();
    return next();
  });

  test('create', (next) => {
    let spy = Sinon.spy();
    let stub = Sinon.stub(modelService.model, 'create').callsArgWith(1, null, {});
    modelService.create({}, spy);
    stub.restore();
    expect(spy.called).to.be.true();
    return next();
  });

  test('find by id and update', (next) => {
    let stub = Sinon.stub(modelService.model, 'findByIdAndUpdate').callsArgWith(3, null, {})
    let spy = Sinon.spy();
    modelService.findByIdAndUpdate('test', {}, spy);
    stub.restore();
    expect(spy.called).to.be.true();
    return next();
  });
  test('find by id and remove', (next) => {
    let stub = Sinon.stub(modelService.model, 'findByIdAndRemove').callsArgWith(1, null, {})
    let spy = Sinon.spy();
    modelService.findByIdAndRemove('test', spy);
    stub.restore();
    expect(spy.called).to.be.true();
    return next();
  });


});
