import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import Mongoose = require("mongoose");
import AuthHandler = require('../../../services/auth.handler');
import UserModel = require('../../../services/user.model');
import RoleModel = require('../../../services/role.model');
import _ = require('lodash');

let lab = exports.lab = Lab.script(),
  before = lab.before,
  beforeEach = lab.beforeEach,
  afterEach = lab.afterEach,
  after = lab.after,
  expect = Code.expect,
  suite = lab.suite,
  test = lab.test;


suite('Test Article Service', () => {
  let server, authHandler, userModel, roleModel;
  before((next) => {
    server = new Hapi.Server();
    userModel = new UserModel.default(server);
    roleModel = new RoleModel.default(server);
    server.plugins = {
      'amma-user': {
        config: {
          options: {
            authsecret: 'test23'
          }
        },
        'userModel': userModel,
        'roleModel': roleModel
      }
    }
    authHandler = new AuthHandler.default(server);
    next();
  });
  test('test register auth', (next) => {
    let registerStub = Sinon.stub(server, 'register', (options, callback) => {
      return callback(null, {});
    });
    let authStub = Sinon.stub(server.auth, 'strategy');
    let authStubDefault = Sinon.stub(server.auth, 'default');
    let callback = Sinon.spy((err, result) => {
      expect(err).to.be.undefined();
      registerStub.restore();
      authStub.restore();
      authStubDefault.restore();
      return next();
    });
    authHandler.registerAuth(callback);
  });

  test('test register auth returns an error', (next) => {
    let registerStub = Sinon.stub(server, 'register', (options, callback) => {
      return callback('temp error', {});
    });
    let authStub = Sinon.stub(server.auth, 'strategy');
    let authStubDefault = Sinon.stub(server.auth, 'default');
    let callback = Sinon.spy((err, result) => {
      expect(err).to.not.empty();
      registerStub.restore();
      authStub.restore();
      authStubDefault.restore();
      return next();
    });
    authHandler.registerAuth(callback);
  });

  test('test create and token success', (next) => {
    let stub = Sinon.stub(userModel, 'findByIdAndUpdateToken', (id, token, callback) => {
      return callback(null, {});
    });
    let callback = Sinon.spy((err, result) => {
      expect(err).to.not.exist();
      expect(result).to.be.string();
      stub.restore();
      return next();
    });
    authHandler.createAndAddToken('test1', callback);
  });

  test('test create and token success', (next) => {
    let stub = Sinon.stub(userModel, 'findByIdAndUpdateToken', (id, token, callback) => {
      return callback('error', {});
    });
    let callback = Sinon.spy((err, result) => {
      expect(err).to.exist();
      stub.restore();
      return next();
    });
    authHandler.createAndAddToken('test1', callback);
  });

  test('test validate no token', (next) => {
    let callback = Sinon.spy((err, result) => {
      expect(err).to.not.exist();
      expect(result).to.be.false();
      return next();
    });
    authHandler.validate(null, Sinon.spy(), callback);
  });
  test('test validate with invalid token', (next) => {
    let stub = Sinon.stub(userModel, 'findByToken', (token, callback) => {
      return callback('error', {});
    });
    let callback = Sinon.spy((err, result) => {
      expect(err).to.not.exist();
      expect(result).to.be.false();
      stub.restore();
      return next();
    });
    authHandler.validate({ token: 'token123' }, Sinon.spy(), callback);
  });

  test('test validate with invalid user', (next) => {
    let stub = Sinon.stub(userModel, 'findByToken', (token, callback) => {
      return callback(null, { isActive: false });
    });
    let callback = Sinon.spy((err, result) => {
      expect(err).to.not.exist();
      expect(result).to.be.false();
      stub.restore();
      return next();
    });
    authHandler.validate({ token: 'token123' }, Sinon.spy(), callback);
  });

  test('test validate with valid user', (next) => {
    let stub = Sinon.stub(userModel, 'findByToken', (token, callback) => {
      return callback(null, { isActive: true });
    });
    let roleStub = Sinon.stub(roleModel, 'findById', (role, callback) => {
      return callback(null, {
        privileges: []
      });
    });
    let callback = Sinon.spy((err, result) => {
      expect(err).to.not.exist();
      expect(result).to.not.empty();
      stub.restore();
      roleStub.restore();
      return next();
    });
    authHandler.validate({ token: 'token123' }, Sinon.spy(), callback);
  });

  test('test validate with valid user, role doesnot exist', (next) => {
    let stub = Sinon.stub(userModel, 'findByToken', (token, callback) => {
      return callback(null, { isActive: true });
    });
    let roleStub = Sinon.stub(roleModel, 'findById', (role, callback) => {
      return callback('error', null);
    });
    let callback = Sinon.spy((err, result) => {
      expect(err).to.not.exist();
      expect(result).to.not.empty();
      stub.restore();
      roleStub.restore();
      return next();
    });
    authHandler.validate({ token: 'token123' }, Sinon.spy(), callback);
  });


  test('test validate with empty user', (next) => {
    let stub = Sinon.stub(userModel, 'findByToken', (token, callback) => {
      return callback(null, {});
    });
    let callback = Sinon.spy((err, result) => {
      expect(err).to.not.exist();
      expect(result).to.be.false();
      stub.restore();
      return next();
    });
    authHandler.validate({ token: 'token123' }, Sinon.spy(), callback);
  });

  test('test validate with valid guest user', (next) => {
    let roleStub = Sinon.stub(roleModel, 'findById', (role, callback) => {
      return callback(null, {
        privileges: []
      });
    });
    let callback = Sinon.spy((err, result) => {
      expect(err).to.not.exist();
      expect(result).to.not.empty();
      roleStub.restore();
      return next();
    });
    authHandler.validate({ token: 'guest' }, Sinon.spy(), callback);
  });

  test('test validate with valid guest role not found', (next) => {
    let roleStub = Sinon.stub(roleModel, 'findById', (role, callback) => {
      return callback('error', null);
    });
    let callback = Sinon.spy((err, result) => {
      expect(err).not.to.be.exist();
      roleStub.restore();
      return next();
    });
    authHandler.validate({ token: 'guest' }, Sinon.spy(), callback);
  });


  test('on request - authorization ', (next) => {
    let request = {
      headers: {
        authorization: null
      }
    };
    let response = {
      continue: Sinon.spy()
    };
    authHandler.onRequest(request, response);
    expect(request.headers.authorization).not.to.be.empty();
    next();
  });

  test('on request - authorization - provided', (next) => {
    let request = {
      headers: {
        authorization: 'test123'
      }
    };
    let response = {
      continue: Sinon.spy()
    };
    authHandler.onRequest(request, response);
    expect(request.headers.authorization).to.be.equal('test123');
    next();
  });


});
