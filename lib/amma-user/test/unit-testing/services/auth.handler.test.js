var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var AuthHandler = require('../../../services/auth.handler');
var UserModel = require('../../../services/user.model');
var RoleModel = require('../../../services/role.model');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Test Article Service', function () {
    var server, authHandler, userModel, roleModel;
    before(function (next) {
        server = new Hapi.Server();
        userModel = new UserModel.default(server);
        roleModel = new RoleModel.default(server);
        server.plugins = {
            'amma-user': {
                config: {
                    options: {
                        authsecret: 'test23',
                        hash: 8
                    }
                },
                'userModel': userModel,
                'roleModel': roleModel
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
        var callback = Sinon.spy(function (err) {
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
        var callback = Sinon.spy(function (err) {
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
            expect(result.token).to.be.string();
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
        var roleStub = Sinon.stub(roleModel, 'findById', function (role, callback) {
            return callback(null, {
                privileges: []
            });
        });
        var callback = Sinon.spy(function (err, result) {
            expect(err).to.not.exist();
            expect(result).to.not.empty();
            stub.restore();
            roleStub.restore();
            return next();
        });
        authHandler.validate({ token: 'token123' }, Sinon.spy(), callback);
    });
    test("test validate with valid user, role doesn't exist", function (next) {
        var stub = Sinon.stub(userModel, 'findByToken', function (token, callback) {
            return callback(null, { isActive: true });
        });
        var roleStub = Sinon.stub(roleModel, 'findById', function (role, callback) {
            return callback(null, {});
        });
        var callback = Sinon.spy(function (err, result) {
            expect(err).to.be.not.exist();
            expect(result).to.be.not.empty();
            stub.restore();
            roleStub.restore();
            return next();
        });
        authHandler.validate({ token: 'token123' }, Sinon.spy(), callback);
    });
    test('test validate with valid user, role error', function (next) {
        var stub = Sinon.stub(userModel, 'findByToken', function (token, callback) {
            return callback(null, { isActive: true });
        });
        var roleStub = Sinon.stub(roleModel, 'findById', function (role, callback) {
            return callback('error', {});
        });
        var callback = Sinon.spy(function (err, result) {
            expect(err).to.be.not.exist();
            expect(result).to.be.not.empty();
            stub.restore();
            roleStub.restore();
            return next();
        });
        authHandler.validate({ token: 'token123' }, Sinon.spy(), callback);
    });
    test('test validate with empty user', function (next) {
        var stub = Sinon.stub(userModel, 'findByToken', function (token, callback) {
            return callback(null, {});
        });
        var callback = Sinon.spy(function (err, result) {
            expect(err).to.not.exist();
            expect(result).to.be.false();
            stub.restore();
            return next();
        });
        authHandler.validate({ token: 'token123' }, Sinon.spy(), callback);
    });
    test('test validate with valid guest user', function (next) {
        var roleStub = Sinon.stub(roleModel, 'findById', function (role, callback) {
            return callback(null, {
                privileges: []
            });
        });
        var callback = Sinon.spy(function (err, result) {
            expect(err).to.not.exist();
            expect(result).to.not.empty();
            roleStub.restore();
            return next();
        });
        authHandler.validate({ token: 'guest' }, Sinon.spy(), callback);
    });
    test('test validate with valid guest role not found', function (next) {
        var roleStub = Sinon.stub(roleModel, 'findById', function (role, callback) {
            return callback('error', null);
        });
        var callback = Sinon.spy(function (err) {
            expect(err).not.to.be.exist();
            roleStub.restore();
            return next();
        });
        authHandler.validate({ token: 'guest' }, Sinon.spy(), callback);
    });
    test('on request - authorization ', function (next) {
        var request = {
            headers: {
                authorization: null
            }
        };
        var response = {
            continue: Sinon.spy()
        };
        authHandler.onRequest(request, response);
        expect(request.headers.authorization).not.to.be.empty();
        next();
    });
    test('on request - authorization - provided', function (next) {
        var request = {
            headers: {
                authorization: 'test123'
            }
        };
        var response = {
            continue: Sinon.spy()
        };
        authHandler.onRequest(request, response);
        expect(request.headers.authorization).to.be.equal('test123');
        next();
    });
    test('Login - error', function (next) {
        var stub = Sinon.stub(userModel, 'canLogin', function (id, password, callback) {
            return callback('error', null);
        });
        var callback = Sinon.spy(function (err) {
            expect(err).to.be.exist();
            stub.restore();
            return next();
        });
        authHandler.login('test1', 'test', callback);
    });
    test('Login - user not found', function (next) {
        var stub = Sinon.stub(userModel, 'canLogin', function (id, password, callback) {
            return callback(null, null);
        });
        var callback = Sinon.spy(function (err) {
            expect(err).to.be.exist();
            stub.restore();
            return next();
        });
        authHandler.login('test1', 'test', callback);
    });
    /*
        test('Login - Bcrypt error', (next) => {
            let stub = Sinon.stub(userModel, 'findById', (id, callback) => {
                return callback(null, {isActive: true});
            });
            let BcryptStub = Sinon.stub(Bcrypt, 'compare', (password, compare, callback) => {
                callback('error');
            });
            let callback = Sinon.spy((err) => {
                expect(err).to.be.exist();
                stub.restore();
                BcryptStub.restore();
                return next();
            });
            authHandler.login('test1', 'test', callback);
        });
    
        test('Login - Bcrypt not match', (next) => {
            let stub = Sinon.stub(userModel, 'findById', (id, callback) => {
                return callback(null, {isActive: true});
            });
            let BcryptStub = Sinon.stub(Bcrypt, 'compare', (password, compare, callback) => {
                callback(null, false);
            });
            let callback = Sinon.spy((err) => {
                expect(err).to.be.exist();
                stub.restore();
                BcryptStub.restore();
                return next();
            });
            authHandler.login('test1', 'test', callback);
        });
    */
    test('Login - Success', function (next) {
        var stub = Sinon.stub(userModel, 'canLogin', function (id, password, callback) {
            return callback(null, { isActive: true });
        });
        var tokenStub = Sinon.stub(userModel, 'findByIdAndUpdateToken', function (id, token, callback) {
            return callback(null, {});
        });
        var callback = Sinon.spy(function (err, result) {
            expect(err).to.be.not.exist();
            expect(result.token).to.be.string();
            stub.restore();
            tokenStub.restore();
            return next();
        });
        authHandler.login('test1', 'test', callback);
    });
    test('Logout - Success', function (next) {
        var stub = Sinon.stub(userModel, 'findByTokenAndRemove', function (id, callback) {
            return callback(null, {});
        });
        var callback = Sinon.spy(function (err) {
            expect(err).to.be.not.exist();
            stub.restore();
            return next();
        });
        authHandler.logout('test1', callback);
    });
});
