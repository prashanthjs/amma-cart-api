var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var RoleService = require('../../../services/role.service');
var RoleModel = require('../../../services/role.model');
var PrivilegeHandler = require('../../../services/privilege.handler');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Test Article Service', function () {
    var server, roleService, roleModel, privilegeHandler;
    var defaultRoles = [
        {
            _id: 'guest',
            title: 'Guest',
            privileges: []
        },
        {
            _id: 'super_power_admin',
            title: 'Super Power admin',
            privileges: []
        }
    ];
    before(function (next) {
        server = new Hapi.Server();
        roleModel = new RoleModel.default(server);
        privilegeHandler = new PrivilegeHandler.default(server);
        server.plugins = {
            'amma-user': {
                config: {
                    options: {
                        defaultRoles: defaultRoles
                    }
                },
                roleModel: roleModel,
                privilegeHandler: privilegeHandler
            }
        };
        roleService = new RoleService.default(server);
        next();
    });
    test('test insert default roles', function (next) {
        var i = 0;
        var stub = Sinon.stub(roleModel, 'findById', function (id, callback) {
            return callback(null, null);
        });
        var createStub = Sinon.stub(roleModel, 'create', function (role, callback) {
            ++i;
            return callback(null, null);
        });
        roleService.onPreStart(server, function () {
            expect(i).to.be.equal(defaultRoles.length);
            stub.restore();
            createStub.restore();
            next();
        });
    });
    test('test insert default roles if already inserted', function (next) {
        var i = 0;
        var stub = Sinon.stub(roleModel, 'findById', function (id, callback) {
            return callback(null, {
                _id: id,
                save: function (_callback) {
                    i++;
                    _callback();
                }
            });
        });
        var createStub = Sinon.stub(roleModel, 'create', function (role, callback) {
            ++i;
            return callback(null, null);
        });
        roleService.onPreStart(server, function () {
            expect(i).to.be.equal(1);
            stub.restore();
            createStub.restore();
            next();
        });
    });
    test('test insert default roles return err', function (next) {
        var i = 0;
        var stub = Sinon.stub(roleModel, 'findById', function (id, callback) {
            return callback('test error', null);
        });
        roleService.onPreStart(server, function (err) {
            expect(err).not.to.be.empty();
            stub.restore();
            next();
        });
    });
});
