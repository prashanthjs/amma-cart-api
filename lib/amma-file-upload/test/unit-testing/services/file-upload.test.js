var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var Path = require('path');
var FsExtra = require('fs-extra');
var FileUpload = require('../../../services/file-upload');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Test File upload', function () {
    var fileUpload;
    var mockFilesDir = __dirname + '/../test-files';
    before(function (next) {
        fileUpload = new FileUpload.default();
        return next();
    });
    test('file exists', function (next) {
        var files = fileUpload.getFiles(mockFilesDir + '/temp');
        expect(files).to.be.an.array();
        next();
    });
    test('test token', function (next) {
        var token = fileUpload.createToken();
        expect(token).not.to.be.an.empty();
        next();
    });
    suite('check File', function () {
        test('file exists', function (next) {
            var bool = fileUpload.checkFileExists(mockFilesDir + '/temp/test.txt');
            expect(bool).to.be.true();
            next();
        });
        test('file not exist if directory is given', function (next) {
            var bool = fileUpload.checkFileExists(mockFilesDir + '/temp');
            expect(bool).to.be.false();
            next();
        });
        test('file not exist', function (next) {
            var bool = fileUpload.checkFileExists(mockFilesDir + '/temp/text2.txt');
            expect(bool).to.be.false();
            next();
        });
    });
    suite('check is image', function () {
        test('test text file', function (next) {
            var bool = fileUpload.isImage(mockFilesDir + '/temp/test.txt');
            expect(bool).to.be.false();
            next();
        });
        test('test image file', function (next) {
            var bool = fileUpload.isImage(mockFilesDir + '/temp/test.png');
            expect(bool).to.be.true();
            next();
        });
    });
    suite('get unique file name', function () {
        test('test unique file if doesnot', function (next) {
            var file = mockFilesDir + '/temp/test1.txt';
            var result = fileUpload.getUniqueFileName(file);
            expect(file).to.be.equal(result);
            next();
        });
        test('test unique file if a file exists', function (next) {
            var file = mockFilesDir + '/temp/test.txt';
            var result = fileUpload.getUniqueFileName(file);
            var fileName = Path.parse(result).name;
            expect(fileName).to.be.equal('test_1');
            next();
        });
    });
    suite('create thumbnail', function () {
        var dir;
        var file;
        var thumbnail = {
            name: 'thumbnail',
            width: 200,
            height: 200
        };
        before(function (next) {
            dir = mockFilesDir + '/temp';
            file = mockFilesDir + '/temp/test.txt';
            FsExtra.removeSync(dir + '/thumbnail');
            next();
        });
        test('test thumbnail', function (next) {
            file = mockFilesDir + '/temp/test.png';
            var sinon = Sinon.spy(function (error) {
                expect(error).to.be.undefined();
                expect(sinon.called).to.be.true();
                next();
            });
            fileUpload.createThumbnail(file, dir, thumbnail, sinon);
        });
        test('test thumbnail already exists', function (next) {
            file = mockFilesDir + '/temp/test.png';
            var sinon = Sinon.spy(function (error) {
                expect(error).to.be.undefined();
                expect(sinon.called).to.be.true();
                next();
            });
            fileUpload.createThumbnail(file, dir, thumbnail, sinon);
        });
        test('not image', function (next) {
            file = mockFilesDir + '/temp/test.txt';
            var sinon = Sinon.spy(function (error) {
                expect(error).to.be.equal('file is not a image');
                expect(sinon.called).to.be.true();
                next();
            });
            fileUpload.createThumbnail(file, dir, thumbnail, sinon);
        });
        test('no file', function (next) {
            file = mockFilesDir + '/temp/test1.txt';
            var sinon = Sinon.spy(function (error) {
                expect(error).to.be.equal('file does not exist');
                expect(sinon.called).to.be.true();
                next();
            });
            fileUpload.createThumbnail(file, dir, thumbnail, sinon);
        });
        after(function (next) {
            FsExtra.removeSync(dir + '/thumbnail');
            next();
        });
    });
    suite('create sync files', function () {
        var dir;
        var targetDir;
        var file;
        before(function (next) {
            dir = mockFilesDir + '/temp';
            targetDir = mockFilesDir + '/target';
            FsExtra.removeSync(targetDir);
            next();
        });
        test('sync files', function (next) {
            var sinon = Sinon.spy(function (error, result) {
                expect(error).to.be.null();
                expect(result.files).to.be.an.array();
                expect(sinon.called).to.be.true();
                next();
            });
            fileUpload.syncFiles(dir, targetDir, sinon);
        });
        after(function (next) {
            FsExtra.removeSync(dir + '/target');
            next();
        });
    });
    suite('create thumbnails', function () {
        var dir;
        var thumbnails = [{
                name: 'thumbnail',
                width: 200,
                height: 200
            }];
        before(function (next) {
            dir = mockFilesDir + '/temp';
            FsExtra.removeSync(dir + '/thumbnail');
            next();
        });
        test('test thumbnail', function (next) {
            var sinon = Sinon.spy(function (error) {
                expect(error).to.be.null();
                expect(sinon.called).to.be.true();
                next();
            });
            fileUpload.createThumbnails(dir, thumbnails, sinon);
        });
        after(function (next) {
            FsExtra.removeSync(dir + '/thumbnail');
            next();
        });
    });
    suite('Test remove file', function () {
        var dir;
        before(function (next) {
            dir = mockFilesDir + '/temp';
            FsExtra.copySync(mockFilesDir + '/temp', mockFilesDir + '/target');
            next();
        });
        test('test thumbnail', function (next) {
            var sinon = Sinon.spy(function (error) {
                expect(error).to.be.null();
                expect(sinon.called).to.be.true();
                next();
            });
            fileUpload.removeFile(mockFilesDir + '/target/test.txt', sinon);
        });
        after(function (next) {
            FsExtra.removeSync(mockFilesDir + '/target');
            next();
        });
    });
    suite('Test file upload', function () {
        var dir;
        before(function (next) {
            dir = mockFilesDir + '/temp';
            FsExtra.copySync(mockFilesDir + '/temp', mockFilesDir + '/target');
            next();
        });
        test('test upload', function (next) {
            var sinon = Sinon.spy(function (error) {
                expect(error).to.be.null();
                expect(sinon.called).to.be.true();
                next();
            });
            var readableStream = FsExtra.createReadStream(mockFilesDir + '/target/test.txt');
            fileUpload.upload(readableStream, 'test2.txt', mockFilesDir + '/target', sinon);
        });
        after(function (next) {
            FsExtra.removeSync(mockFilesDir + '/target');
            next();
        });
    });
});
