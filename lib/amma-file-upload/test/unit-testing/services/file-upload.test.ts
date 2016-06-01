import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import Path = require('path');
import FsExtra = require('fs-extra');
import FileUpload = require('../../../services/file-upload');

let lab = exports.lab = Lab.script(),
  before = lab.before,
  beforeEach = lab.beforeEach,
  afterEach = lab.afterEach,
  after = lab.after,
  expect = Code.expect,
  suite = lab.suite,
  test = lab.test;

suite('Test File upload', () => {
  let fileUpload;
  let mockFilesDir = __dirname + '/../test-files';

  before((next) => {
    fileUpload = new FileUpload.default();
    return next();
  });

  test('file exists', (next) => {
    let files = fileUpload.getFiles(mockFilesDir + '/temp');
    expect(files).to.be.an.array();
    next();
  });


  test('test token', (next) => {
    let token = fileUpload.createToken();
    expect(token).not.to.be.an.empty();
    next();
  });


  suite('check File', () => {
    test('file exists', (next) => {
      let bool = fileUpload.checkFileExists(mockFilesDir + '/temp/test.txt');
      expect(bool).to.be.true();
      next();
    });
    test('file not exist if directory is given', (next) => {
      let bool = fileUpload.checkFileExists(mockFilesDir + '/temp');
      expect(bool).to.be.false();
      next();
    });
    test('file not exist', (next) => {
      let bool = fileUpload.checkFileExists(mockFilesDir + '/temp/text2.txt');
      expect(bool).to.be.false();
      next();
    });
  });

  suite('check is image', () => {
    test('test text file', (next) => {
      let bool = fileUpload.isImage(mockFilesDir + '/temp/test.txt');
      expect(bool).to.be.false();
      next();
    });
    test('test image file', (next) => {
      let bool = fileUpload.isImage(mockFilesDir + '/temp/test.png');
      expect(bool).to.be.true();
      next();
    });
  });

  suite('get unique file name', () => {
    test('test unique file if doesnot', (next) => {
      let file = mockFilesDir + '/temp/test1.txt';
      let result = fileUpload.getUniqueFileName(file);
      expect(file).to.be.equal(result);
      next();
    });

    test('test unique file if a file exists', (next) => {
      let file = mockFilesDir + '/temp/test.txt';
      let result = fileUpload.getUniqueFileName(file);
      let fileName = Path.parse(result).name;
      expect(fileName).to.be.equal('test_1');
      next();
    });

  });

  suite('create thumbnail', () => {
    let dir;
    let file;
    let thumbnail = {
      name: 'thumbnail',
      width: 200,
      height: 200
    };
    before((next) => {
      dir = mockFilesDir + '/temp';
      file = mockFilesDir + '/temp/test.txt';
      FsExtra.removeSync(dir + '/thumbnail');
      next();
    });
    test('test thumbnail', (next) => {
      file = mockFilesDir + '/temp/test.png';
      let sinon = Sinon.spy((error) => {
        expect(error).to.be.undefined();
        expect(sinon.called).to.be.true();
        next();
      });
      fileUpload.createThumbnail(file, dir, thumbnail, sinon);
    });

    test('test thumbnail already exists', (next) => {
      file = mockFilesDir + '/temp/test.png';
      let sinon = Sinon.spy((error) => {
        expect(error).to.be.undefined();
        expect(sinon.called).to.be.true();
        next();
      });
      fileUpload.createThumbnail(file, dir, thumbnail, sinon);
    });

    test('not image', (next) => {
      file = mockFilesDir + '/temp/test.txt';
      let sinon = Sinon.spy((error) => {
        expect(error).to.be.equal('file is not a image');
        expect(sinon.called).to.be.true();
        next();
      });
      fileUpload.createThumbnail(file, dir, thumbnail, sinon);
    });

    test('no file', (next) => {
      file = mockFilesDir + '/temp/test1.txt';
      let sinon = Sinon.spy((error) => {
        expect(error).to.be.equal('file does not exist');
        expect(sinon.called).to.be.true();
        next();
      });
      fileUpload.createThumbnail(file, dir, thumbnail, sinon);
    });

    after((next) => {
      FsExtra.removeSync(dir + '/thumbnail');
      next();
    });
  });

  suite('create sync files', () => {
    let dir;
    let targetDir;
    let file;
    before((next) => {
      dir = mockFilesDir + '/temp';
      targetDir = mockFilesDir + '/target';
      FsExtra.removeSync(targetDir);
      next();
    });
    test('sync files', (next) => {
      let sinon = Sinon.spy((error, result) => {
        expect(error).to.be.null();
        expect(result.files).to.be.an.array();
        expect(sinon.called).to.be.true();
        next();
      });
      fileUpload.syncFiles(dir, targetDir, sinon);
    });

    after((next) => {
      FsExtra.removeSync(dir + '/target');
      next();
    });
  });

  suite('create thumbnails', () => {
    let dir;
    let thumbnails = [{
      name: 'thumbnail',
      width: 200,
      height: 200
    }];
    before((next) => {
      dir = mockFilesDir + '/temp';
      FsExtra.removeSync(dir + '/thumbnail');
      next();
    });
    test('test thumbnail', (next) => {
      let sinon = Sinon.spy((error) => {
        expect(error).to.be.null();
        expect(sinon.called).to.be.true();
        next();
      });
      fileUpload.createThumbnails(dir, thumbnails, sinon);
    });
    after((next) => {
      FsExtra.removeSync(dir + '/thumbnail');
      next();
    });
  });

  suite('Test remove file', () => {
    let dir;
    before((next) => {
      dir = mockFilesDir + '/temp';
      FsExtra.copySync(mockFilesDir + '/temp', mockFilesDir + '/target');
      next();
    });
    test('test thumbnail', (next) => {
      let sinon = Sinon.spy((error) => {
        expect(error).to.be.null();
        expect(sinon.called).to.be.true();
        next();
      });
      fileUpload.removeFile(mockFilesDir + '/target/test.txt', sinon);
    });
    after((next) => {
      FsExtra.removeSync(mockFilesDir + '/target');
      next();
    });
  });

  suite('Test file upload', () => {
    let dir;
    before((next) => {
      dir = mockFilesDir + '/temp';
      FsExtra.copySync(mockFilesDir + '/temp', mockFilesDir + '/target');
      next();
    });
    test('test upload', (next) => {
      let sinon = Sinon.spy((error) => {
        expect(error).to.be.null();
        expect(sinon.called).to.be.true();
        next();
      });
      let readableStream = FsExtra.createReadStream(mockFilesDir + '/target/test.txt');
      fileUpload.upload(readableStream, 'test2.txt', mockFilesDir + '/target', sinon);
    });
    after((next) => {
      FsExtra.removeSync(mockFilesDir + '/target');
      next();
    });
  });

});
