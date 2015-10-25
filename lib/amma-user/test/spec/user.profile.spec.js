var Code = require('code');
var Lab = require('lab');
var Fs = require('fs');
var FormData = require('form-data');
var StreamToPromise = require('stream-to-promise');
var HapiServer = require('./lib/server');
var SampleData = require('./data/sample.data');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, it = lab.it;
suite('User profile functionality', function () {
    var server;
    var service;
    var token;
    before(function (next) {
        HapiServer(function (serverObject) {
            server = serverObject;
            service = server.plugins['amma-user']['userModel'];
            service.model.create(SampleData.initData, function (err, result) {
                return next();
            });
        });
    });
    after(function (next) {
        service.model.remove().exec(function () {
            server.stop({ timeout: 60 * 1000 }, next);
        });
    });
    it('get all images for new user ', function (next) {
        var options = {
            method: 'GET',
            url: '/users/get-image-with-token'
        };
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(200);
            expect(response.result.token).to.be.a.string();
            return next();
        });
    });
    it('get all images for user', function (next) {
        var options = {
            method: 'GET',
            url: '/users/get-image-with-token/' + SampleData.initData[0]._id
        };
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(200);
            token = response.result.token;
            expect(response.result.token).to.be.a.string();
            return next();
        });
    });
    it('upload an image', function (next) {
        var form = new FormData();
        form.append('file', Fs.createReadStream(__dirname + '/data/test.png'));
        StreamToPromise(form).then(function (payload) {
            var options = {
                method: 'POST',
                url: '/users/upload-image/' + token,
                headers: form.getHeaders({
                    token: token
                }),
                payload: payload
            };
            server.inject(options, function (response) {
                var result = response.result;
                Code.expect(result.filename).to.equal('test.png');
                Code.expect(response.statusCode).to.equal(200);
                next();
            });
        });
    });
    it('save the image', function (next) {
        var options = {
            method: 'GET',
            url: '/users/' + SampleData.initData[0]._id + '/save/' + token,
        };
        server.inject(options, function (response) {
            var result = response.result;
            Code.expect(response.statusCode).to.equal(200);
            next();
        });
    });
    it('get images', function (next) {
        var options = {
            method: 'GET',
            url: '/users/' + SampleData.initData[0]._id + '/images'
        };
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(200);
            console.log(response.result.files);
            //expect(response.files).to.be.a.string();
            return next();
        });
    });
    it('delete an image', function (next) {
        var options = {
            method: 'DELETE',
            url: '/users/remove-file/' + token + '/test.png',
        };
        server.inject(options, function (response) {
            var result = response.result;
            Code.expect(response.statusCode).to.equal(200);
            next();
        });
    });
    it('again save the image', function (next) {
        var options = {
            method: 'GET',
            url: '/users/' + SampleData.initData[0]._id + '/save/' + token,
        };
        server.inject(options, function (response) {
            var result = response.result;
            Code.expect(result.success).to.be.true();
            Code.expect(response.statusCode).to.equal(200);
            next();
        });
    });
});
