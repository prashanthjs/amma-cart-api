var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var Path = require('path');
var FsExtra = require('fs-extra');
var FileUploadHelper = require('../../../services/file-upload-helper');
var FileUploader = require('../../../services/file-upload');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Test File upload', function () {
    var FileUploaderFactory;
    var fileUploadHelper;
    var server;
    var options;
    var token;
    var ext;
    before(function (next) {
        server = new Hapi.Server();
        server.plugins = {
            'amma-file-upload': {
                'fileUpload': new FileUploader.default()
            }
        };
        FileUploaderFactory = new FileUploadHelper.default(server);
        options = {
            tempDir: __dirname + '/../test-files-helper/temp',
            srcDir: __dirname + '/../test-files-helper/src',
            thumbnails: [{
                    'name': 'thumbnail',
                    'width': 200,
                    'height': 200
                }]
        };
        ext = '1';
        fileUploadHelper = FileUploaderFactory.getInstance(options);
        return next();
    });
    test('test create token', function (next) {
        var sinon = Sinon.spy(function (error, result) {
            expect(error).to.be.null();
            token = result.token;
            expect(result.token).not.to.be.empty();
            expect(sinon.called).to.be.true();
            next();
        });
        fileUploadHelper.createToken(ext, sinon);
    });
    test('test syncTempToSrc', function (next) {
        var sinon = Sinon.spy(function (error, result) {
            expect(error).to.be.null();
            expect(result.files).to.be.an.array();
            expect(sinon.called).to.be.true();
            next();
        });
        fileUploadHelper.syncTempToSrc(token, ext, sinon);
    });
    test('test upload success', function (next) {
        var sinon = Sinon.spy(function (error, result) {
            expect(error).to.be.null();
            expect(sinon.called).to.be.true();
            next();
        });
        var readableStream = FsExtra.createReadStream(Path.join(options.srcDir, '1', 'test.txt'));
        fileUploadHelper.upload(token, readableStream, 'test2.txt', sinon);
    });
    test('test upload failure', function (next) {
        options.validExtensions = ['.png'];
        var sinon = Sinon.spy(function (error, result) {
            expect(error).not.to.be.empty();
            expect(sinon.called).to.be.true();
            next();
        });
        var readableStream = FsExtra.createReadStream(Path.join(options.srcDir, '1', 'test.txt'));
        fileUploadHelper.upload(token, readableStream, 'test2.txt', sinon);
        delete options.validExtensions;
    });
    test('remove file', function (next) {
        var sinon = Sinon.spy(function (error, result) {
            expect(error).to.be.null();
            expect(sinon.called).to.be.true();
            next();
        });
        fileUploadHelper.removeFile(token, 'test2.txt', sinon);
    });
    test('test validation empty', function (next) {
        var result = fileUploadHelper._isValid('test2.txt');
        expect(result).to.be.true();
        next();
    });
    test('test validation success', function (next) {
        options.validExtensions = ['.txt'];
        var result = fileUploadHelper._isValid('test2.txt');
        expect(result).to.be.true();
        next();
    });
    test('test validation failure', function (next) {
        options.validExtensions = ['.png'];
        var result = fileUploadHelper._isValid('test2.txt');
        expect(result).to.be.false();
        next();
    });
    after(function (next) {
        FsExtra.removeSync(options.tempDir);
        next();
    });
});
