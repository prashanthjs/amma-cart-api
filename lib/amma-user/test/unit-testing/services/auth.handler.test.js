var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var AuthHandler = require('../../../services/auth.handler');
var UserModel = require('../../../services/user.model');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Test Article Service', function () {
    var server;
    var authHandler;
    var userModel;
    before(function (next) {
        server = new Hapi.Server();
        userModel = new UserModel.default(server);
        server.plugins = {
            'amma-user': {
                config: {
                    options: {
                        authsecret: 'test23'
                    }
                },
                'userModel': userModel
            }
        };
        authHandler = new AuthHandler.default(server);
        next();
    });
    test('test register auth', function (next) {
        var registerStub = Sinon.stub(server, 'register', function (options, callback) {
            return callback(null, {});
        });
        var authStub = Sinon.stub(server.auth, 'strategy');
        var authStubDefault = Sinon.stub(server.auth, 'default');
        var callback = Sinon.spy(function (err, result) {
            expect(err).to.be.undefined();
            registerStub.restore();
            authStub.restore();
            authStubDefault.restore();
            return next();
        });
        authHandler.registerAuth(callback);
    });
    test('test register auth returns an error', function (next) {
        var registerStub = Sinon.stub(server, 'register', function (options, callback) {
            return callback('temp error', {});
        });
        var authStub = Sinon.stub(server.auth, 'strategy');
        var authStubDefault = Sinon.stub(server.auth, 'default');
        var callback = Sinon.spy(function (err, result) {
            expect(err).to.not.empty();
            registerStub.restore();
            authStub.restore();
            authStubDefault.restore();
            return next();
        });
        authHandler.registerAuth(callback);
    });
    test('test create and token success', function (next) {
        var stub = Sinon.stub(userModel, 'findByIdAndUpdateToken', function (id, token, callback) {
            return callback(null, {});
        });
        var callback = Sinon.spy(function (err, result) {
            expect(err).to.not.exist();
            expect(result).to.be.string();
            stub.restore();
            return next();
        });
        authHandler.createAndAddToken('test1', callback);
    });
    test('test create and token success', function (next) {
        var stub = Sinon.stub(userModel, 'findByIdAndUpdateToken', function (id, token, callback) {
            return callback('error', {});
        });
        var callback = Sinon.spy(function (err, result) {
            expect(err).to.exist();
            stub.restore();
            return next();
        });
        authHandler.createAndAddToken('test1', callback);
    });
    test('test validate no token', function (next) {
        var callback = Sinon.spy(function (err, result) {
            expect(err).to.not.exist();
            expect(result).to.be.false();
            return next();
        });
        authHandler.validate(null, Sinon.spy(), callback);
    });
    test('test validate with invalid token', function (next) {
        var stub = Sinon.stub(userModel, 'findByToken', function (token, callback) {
            return callback('error', {});
        });
        var callback = Sinon.spy(function (err, result) {
            expect(err).to.not.exist();
            expect(result).to.be.false();
            stub.restore();
            return next();
        });
        authHandler.validate({ token: 'token123' }, Sinon.spy(), callback);
    });
    test('test validate with invalid user', function (next) {
        var stub = Sinon.stub(userModel, 'findByToken', function (token, callback) {
            return callback(null, { isActive: false });
        });
        var callback = Sinon.spy(function (err, result) {
            expect(err).to.not.exist();
            expect(result).to.be.false();
            stub.restore();
            return next();
        });
        authHandler.validate({ token: 'token123' }, Sinon.spy(), callback);
    });
    test('test validate with valid user', function (next) {
        var stub = Sinon.stub(userModel, 'findByToken', function (token, callback) {
            return callback(null, { isActive: true });
        });
        var callback = Sinon.spy(function (err, result) {
            expect(err).to.not.exist();
            expect(result).to.not.empty();
            stub.restore();
            return next();
        });
        authHandler.validate({ token: 'token123' }, Sinon.spy(), callback);
    });
});
