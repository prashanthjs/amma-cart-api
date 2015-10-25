import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
let HapiServer = require('./lib/server');
let SampleData = require('./data/sample.data');

let lab = exports.lab = Lab.script(),
  before = lab.before,
  beforeEach = lab.beforeEach,
  afterEach = lab.afterEach,
  after = lab.after,
  expect = Code.expect,
  suite = lab.suite,
  it = lab.it;



suite('User api functionality', () => {
  let server;
  let service;
  before((next) => {
    HapiServer((serverObject: Hapi.Server) => {
      server = serverObject;
      service = server.plugins['amma-user']['userModel'];
      return next();
    });
  });
  after((next) => {
    server.stop({ timeout: 60 * 1000 }, next);
  });

  beforeEach((next) => {
    service.model.create(SampleData.initData, function(err,result){
      if(err){
        console.log(err);
      }
      return next();
    });
  });
  afterEach((next) => {
    service.model.remove().exec(next);
  });

  it('get all users ', (next) => {
    let options = {
      method: 'GET',
      url: '/users'
    };
    server.inject(options, (response) => {
      let result = response.result;
      expect(response.statusCode).to.equal(200);
      expect(result.results).to.be.instanceof(Array);
      expect(result.results.length).to.be.equal(SampleData.initData.length);
      return next();
    });
  });


  it('get user ', (next) => {
    let options = {
      method: 'GET',
      url: '/users/test3'
    };
    server.inject(options, (response) => {
      let result = response.result;
      expect(response.statusCode).to.equal(200);
      expect(result._id).to.equal('test3');
      return next();
    });
  });

  it('create an user', (next) => {
    let options = {
      method: 'POST',
      url: '/users',
      payload: SampleData.creationData
    };
    server.inject(options, (response) => {
      expect(response.statusCode).to.equal(201);
      expect(response.result._id).to.equal(options.payload._id);
      return next();
    });
  });

  it('update an user', function(next) {
    let options = {
      method: 'PUT',
      url: '/users/test3',
      payload:  SampleData.updateData
    };
    server.inject(options, (response) => {
      expect(response.statusCode).to.equal(200);
      expect(response.result.name.firstName).to.equal(options.payload.name.firstName);
      return next();
    });
  });

  it('delete an user', (next) => {
    let options = {
      method: 'DELETE',
      url: '/users/test3'
    };
    server.inject(options, (response) => {
      expect(response.statusCode).to.equal(204);
      return next();
    });
  });


});
