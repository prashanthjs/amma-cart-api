var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var PrivilegeHandler = require('../../../services/privilege.handler');
var _ = require('lodash');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Test Article Service', function () {
    var server;
    var privilegeHandler;
    var privileges = [
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
    var privileges2 = [
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
    ];
    before(function (next) {
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
        };
        privilegeHandler = new PrivilegeHandler.default(server);
        next();
    });
    test('get all privileges', function (next) {
        var priv = _.union(privileges, privileges2);
        expect(privilegeHandler.privileges).to.deep.equal(priv);
        next();
    });
    test('get scopes', function (next) {
        var priv = _.union(privileges, privileges2);
        var scopes = [];
        for (var i = 0; i < priv.length; i++) {
            scopes.push(priv[i].name);
        }
        expect(privilegeHandler.scopes).to.deep.equal(scopes);
        next();
    });
    test('get getScopesForDefaultRole', function (next) {
        var scopes = ['test2', 'test3'];
        var returnScopes = privilegeHandler.getScopesForDefaultRole('guest');
        expect(returnScopes).to.deep.equal(scopes);
        next();
    });
    test('get getScopesForDefaultRole to be empty', function (next) {
        var scopes = [];
        var returnScopes = privilegeHandler.getScopesForDefaultRole('test1');
        expect(returnScopes).to.deep.equal(scopes);
        next();
    });
});
