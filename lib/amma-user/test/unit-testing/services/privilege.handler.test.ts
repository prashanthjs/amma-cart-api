import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
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
    let server;
    let privilegeHandler;
    let privileges:PrivilegeHandler.IPrivilege[] = [
        {
            name: 'test1',
            title: 'test1 privilege'
        },
        {
            name: 'test2',
            title: 'test2 privilege',
            description: 'test2 description',
            defaultRoleAccess: 'guest'
        },
    ];
    let privileges2:PrivilegeHandler.IPrivilege[] = [
        {
            name: 'test3',
            title: 'test3 privilege',
            defaultRoleAccess: ['guest', 'user']
        },
        {
            name: 'test4',
            title: 'test4 privilege',
            description: 'test4 description'
        },
    ]
    before((next) => {
        server = new Hapi.Server();

        server.plugins = {
            'amma-user': {
                config: {
                    options: {
                        privileges: privileges
                    }
                },
            },
            'amma-role': {
                config: {
                    options: {
                        privileges: privileges2
                    }
                }
            }
        }
        privilegeHandler = new PrivilegeHandler.default(server);
        next();
    });
    test('get all privileges', (next) => {
        let priv = _.union(privileges, privileges2);
        expect(privilegeHandler.privileges).to.deep.equal(priv);
        next();
    });
    test('get scopes', (next) => {
        let priv = _.union(privileges, privileges2);
        let scopes = [];
        for (let i = 0; i < priv.length; i++) {
            scopes.push(priv[i].name)
        }
        expect(privilegeHandler.scopes).to.deep.equal(scopes);
        next();
    });

    test('get getScopesForDefaultRole', (next) => {

        let scopes = ['test2', 'test3'];
        let returnScopes = privilegeHandler.getScopesForDefaultRole('guest');
        expect(returnScopes).to.deep.equal(scopes);
        next();
    });

    test('get getScopesForDefaultRole to be empty', (next) => {

        let scopes = [];
        let returnScopes = privilegeHandler.getScopesForDefaultRole('test1');
        expect(returnScopes).to.deep.equal(scopes);
        next();
    });

});
