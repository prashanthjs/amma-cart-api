import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import UserService = require('../../../services/user.service');
import UserModel = require('../../../services/user.model');

let lab = exports.lab = Lab.script(),
    before = lab.before,
    beforeEach = lab.beforeEach,
    afterEach = lab.afterEach,
    after = lab.after,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;


suite('Test Article Service', () => {
    let server, userService, userModel;


    let defaultUsers = [
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

    before((next) => {
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
    test('test insert default users', (next) => {
        let i = 0;
        let stub = Sinon.stub(userModel, 'findById', (id, callback) => {
            return callback(null, null);
        });

        let createStub = Sinon.stub(userModel, 'create', (role, callback) => {
            ++i;
            return callback(null, null);
        });
        userService.onPreStart(server, () => {
            expect(i).to.be.equal(defaultUsers.length);
            stub.restore();
            createStub.restore();
            next();
        })

    });

    test('test insert default users if already inserted', (next) => {
        let i = 0;
        let stub = Sinon.stub(userModel, 'findById', (id, callback) => {
            i++;
            return callback(null, {
                _id: id,
            });
        });

        userService.onPreStart(server, () => {
            expect(i).to.be.equal(1);
            stub.restore();
            next();
        })

    });

    test('test insert default users return err', (next) => {
        let i = 0;
        let stub = Sinon.stub(userModel, 'findById', (id, callback) => {
            i++;
            return callback('test error', null);
        });

        userService.onPreStart(server, (err) => {
            expect(err).not.to.be.empty();
            expect(i).to.be.equal(1);
            stub.restore();
            next();
        })
    });

});
