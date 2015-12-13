var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var UserService = require('../../../services/user.service');
var UserModel = require('../../../services/user.model');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Test Article Service', function () {
    var server, userService, userModel;
    var defaultUsers = [
        {
            _id: 'admin',
            name: {
                firstName: 'admin',
                lastName: 'admin'
            },
            email: 'admin@gmail.com',
            password: 'test123'
        }
    ];
    before(function (next) {
        server = new Hapi.Server();
        userModel = new UserModel.default(server);
        server.plugins = {
            'amma-user': {
                config: {
                    options: {
                        defaultUsers: defaultUsers
                    }
                },
                userModel: userModel
            }
        };
        userService = new UserService.default(server);
        next();
    });
    test('test insert default users', function (next) {
        var i = 0;
        var stub = Sinon.stub(userModel, 'findById', function (id, callback) {
            return callback(null, null);
        });
        var createStub = Sinon.stub(userModel, 'create', function (role, callback) {
            ++i;
            return callback(null, null);
        });
        userService.onPreStart(server, function () {
            expect(i).to.be.equal(defaultUsers.length);
            stub.restore();
            createStub.restore();
            next();
        });
    });
    test('test insert default users if already inserted', function (next) {
        var i = 0;
        var stub = Sinon.stub(userModel, 'findById', function (id, callback) {
            i++;
            return callback(null, {
                _id: id,
            });
        });
        userService.onPreStart(server, function () {
            expect(i).to.be.equal(1);
            stub.restore();
            next();
        });
    });
    test('test insert default users return err', function (next) {
        var i = 0;
        var stub = Sinon.stub(userModel, 'findById', function (id, callback) {
            i++;
            return callback('test error', null);
        });
        userService.onPreStart(server, function (err) {
            expect(err).not.to.be.empty();
            expect(i).to.be.equal(1);
            stub.restore();
            next();
        });
    });
});
