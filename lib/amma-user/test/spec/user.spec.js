var Code = require('code');
var Lab = require('lab');
var HapiServer = require('./lib/server');
var SampleData = require('./data/sample.data');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, it = lab.it;
suite('User api functionality', function () {
    var server;
    var service;
    before(function (next) {
        HapiServer(function (serverObject) {
            server = serverObject;
            service = server.plugins['amma-user']['userModel'];
            return next();
        });
    });
    after(function (next) {
        server.stop({ timeout: 60 * 1000 }, next);
    });
    beforeEach(function (next) {
        service.model.create(SampleData.initData, function (err, result) {
            if (err) {
                console.log(err);
            }
            return next();
        });
    });
    afterEach(function (next) {
        service.model.remove().exec(next);
    });
    it('get all users ', function (next) {
        var options = {
            method: 'GET',
            url: '/users'
        };
        server.inject(options, function (response) {
            var result = response.result;
            expect(response.statusCode).to.equal(200);
            expect(result.results).to.be.instanceof(Array);
            expect(result.results.length).to.be.equal(SampleData.initData.length);
            return next();
        });
    });
    it('get user ', function (next) {
        var options = {
            method: 'GET',
            url: '/users/test3'
        };
        server.inject(options, function (response) {
            var result = response.result;
            expect(response.statusCode).to.equal(200);
            expect(result._id).to.equal('test3');
            return next();
        });
    });
    it('create an user', function (next) {
        var options = {
            method: 'POST',
            url: '/users',
            payload: SampleData.creationData
        };
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(201);
            expect(response.result._id).to.equal(options.payload._id);
            return next();
        });
    });
    it('update an user', function (next) {
        var options = {
            method: 'PUT',
            url: '/users/test3',
            payload: SampleData.updateData
        };
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(200);
            expect(response.result.name.firstName).to.equal(options.payload.name.firstName);
            return next();
        });
    });
    it('delete an user', function (next) {
        var options = {
            method: 'DELETE',
            url: '/users/test3'
        };
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(204);
            return next();
        });
    });
});
