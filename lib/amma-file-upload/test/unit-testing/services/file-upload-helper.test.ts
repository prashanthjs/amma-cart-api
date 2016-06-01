import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import Path = require('path');
import FsExtra = require('fs-extra');
import FileUploadHelper = require('../../../services/file-upload-helper');
import FileUploader = require('../../../services/file-upload');


let lab = exports.lab = Lab.script(),
  before = lab.before,
  beforeEach = lab.beforeEach,
  afterEach = lab.afterEach,
  after = lab.after,
  expect = Code.expect,
  suite = lab.suite,
  test = lab.test;

suite('Test File upload', () => {
  let FileUploaderFactory;
  let fileUploadHelper;
  let server;
  let options;
  let token;
  let ext;
  before((next) => {
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
  test('test create token', (next) => {
    let sinon = Sinon.spy((error, result) => {
      expect(error).to.be.null();
      token = result.token;
      expect(result.token).not.to.be.empty();
      expect(sinon.called).to.be.true();
      next();
    });
    fileUploadHelper.createToken(ext, sinon);
  });



  test('test syncTempToSrc', (next) => {
    let sinon = Sinon.spy((error, result) => {
      expect(error).to.be.null();
      expect(result.files).to.be.an.array();
      expect(sinon.called).to.be.true();
      next();
    });
    fileUploadHelper.syncTempToSrc(token, ext, sinon);
  });

  test('test upload success', (next) => {
    let sinon = Sinon.spy((error, result) => {
      expect(error).to.be.null();
      expect(sinon.called).to.be.true();
      next();
    });
    let readableStream = FsExtra.createReadStream(Path.join(options.srcDir, '1', 'test.txt'));
    fileUploadHelper.upload(token, readableStream, 'test2.txt', sinon);
  });
  test('test upload failure', (next) => {
    options.validExtensions = ['.png'];
    let sinon = Sinon.spy((error, result) => {
      expect(error).not.to.be.empty();
      expect(sinon.called).to.be.true();
      next();
    });
    let readableStream = FsExtra.createReadStream(Path.join(options.srcDir, '1', 'test.txt'));
    fileUploadHelper.upload(token, readableStream, 'test2.txt', sinon);
    delete options.validExtensions;
  });

  test('remove file', (next) => {
    let sinon = Sinon.spy((error, result) => {
      expect(error).to.be.null();
      expect(sinon.called).to.be.true();
      next();
    });
    fileUploadHelper.removeFile(token, 'test2.txt', sinon);
  });

  test('test validation empty', (next) => {
    let result = fileUploadHelper._isValid('test2.txt');
    expect(result).to.be.true();
    next();
  });
  test('test validation success', (next) => {
    options.validExtensions = ['.txt'];
    let result = fileUploadHelper._isValid('test2.txt');
    expect(result).to.be.true();
    next();
  });

  test('test validation failure', (next) => {
    options.validExtensions = ['.png'];
    let result = fileUploadHelper._isValid('test2.txt');
    expect(result).to.be.false();
    next();
  });

  after((next) => {
    FsExtra.removeSync(options.tempDir);
    next();
  });

});
