import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Fs = require('fs');
import Stream = require('stream');

let FormData = require('form-data');
let StreamToPromise = require('stream-to-promise');

let HapiServer = require('./lib/server');
let SampleData = require('./data/sample.data');

let lab = exports.lab = Lab.script(),
    before = lab.before,
    beforeEach = lab.beforeEach,
    afterEach = lab.afterEach,
    after = lab.after,
    expect = Code.expect,
    suite = lab.suite,
    it = lab.it;

suite('User profile functionality', () => {
    let server;
    let service;
    let token;
    before((next) => {
        HapiServer((serverObject:Hapi.Server) => {
            server = serverObject;
            service = server.plugins['amma-user']['userModel'];
            service.model.create(SampleData.initData, function (err, result) {
                return next();
            });
        });
    });
    after((next) => {
        service.model.remove().exec(function () {
            server.stop({timeout: 60 * 1000}, next);
        });
    });

    it('get all images for new user ', (next) => {
        let options = {
            method: 'GET',
            url: '/users/get-image-with-token'
        };
        server.inject(options, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.result.token).to.be.a.string();
            return next();
        });
    });

    it('get all images for user', (next) => {
        let options = {
            method: 'GET',
            url: '/users/get-image-with-token/' + SampleData.initData[0]._id
        };
        server.inject(options, (response) => {
            expect(response.statusCode).to.equal(200);
            token = response.result.token;
            expect(response.result.token).to.be.a.string();
            return next();
        });
    });
    it('upload an image', (next) => {
        let form = new FormData();
        form.append('file', Fs.createReadStream(__dirname + '/data/test.png'));
        StreamToPromise(form).then(function (payload) {
            let options = {
                method: 'POST',
                url: '/users/upload-image/' + token,
                headers: form.getHeaders({
                    token: token
                }),
                payload: payload
            };
            server.inject(options, function (response) {
                let result = response.result;
                Code.expect(result.filename).to.equal('test.png');
                Code.expect(response.statusCode).to.equal(200);
                next();
            });
        });
    });

    it('save the image', (next) => {
        let options = {
            method: 'GET',
            url: '/users/' + SampleData.initData[0]._id + '/save/' + token,
        };
        server.inject(options, function (response) {
            let result = response.result;
            Code.expect(response.statusCode).to.equal(200);
            next();
        });
    });

    it('get images', (next) => {
        let options = {
            method: 'GET',
            url: '/users/' + SampleData.initData[0]._id + '/images'
        };
        server.inject(options, (response) => {
            expect(response.statusCode).to.equal(200);
            console.log(response.result.files);

            //expect(response.files).to.be.a.string();
            return next();
        });
    });

    it('delete an image', (next) => {
        let options = {
            method: 'DELETE',
            url: '/users/remove-file/' + token + '/test.png',
        };
        server.inject(options, function (response) {
            let result = response.result;
            Code.expect(response.statusCode).to.equal(200);
            next();
        });

    });
    it('again save the image', (next) => {
        let options = {
            method: 'GET',
            url: '/users/' + SampleData.initData[0]._id + '/save/' + token,
        };
        server.inject(options, function (response) {
            let result = response.result;
            Code.expect(result.success).to.be.true();
            Code.expect(response.statusCode).to.equal(200);
            next();
        });
    });

});
