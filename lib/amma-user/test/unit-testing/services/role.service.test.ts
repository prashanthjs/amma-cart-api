import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import RoleService = require('../../../services/role.service');
import RoleModel = require('../../../services/role.model');
import PrivilegeHandler = require('../../../services/privilege.handler');

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
    let server, roleService, roleModel, privilegeHandler;


    let defaultRoles = [
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

    before((next) => {
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
        }
        roleService = new RoleService.default(server);
        next();
    });
    test('test insert default roles', (next) => {
        let i = 0;
        let stub = Sinon.stub(roleModel, 'findById', (id, callback) => {
            return callback(null, null);
        });

        let createStub = Sinon.stub(roleModel, 'create', (role, callback) => {
            ++i;
            return callback(null, null);
        });
        roleService.onPreStart(server, () => {
            expect(i).to.be.equal(defaultRoles.length);
            stub.restore();
            createStub.restore();
            next();
        })

    });

    test('test insert default roles if already inserted', (next) => {
        let i = 0;
        let stub = Sinon.stub(roleModel, 'findById', (id, callback) => {
            return callback(null, {
                _id: id,
                save: function (_callback) {
                    i++;
                    _callback();
                }
            });
        });

        let createStub = Sinon.stub(roleModel, 'create', (role, callback) => {
            ++i;
            return callback(null, null);
        });
        roleService.onPreStart(server, () => {
            expect(i).to.be.equal(1);
            stub.restore();
            createStub.restore();
            next();
        })

    });

    test('test insert default roles return err', (next) => {
        let i = 0;
        let stub = Sinon.stub(roleModel, 'findById', (id, callback) => {
            return callback('test error', null);
        });

        roleService.onPreStart(server, (err) => {
            expect(err).not.to.be.empty();
            stub.restore();
            next();
        })
    });

});
