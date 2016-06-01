var Async = require('async');
var Fs = require('fs');
var Mkdirp = require('mkdirp');
var Path = require('path');
var FsExtra = require('fs-extra');
var Gm = require('gm');
var Mime = require('mime');
var Uuid = require('node-uuid');
var FileUploader = (function () {
    function FileUploader() {
    }
    /**
     *
     * @returns {string}
     */
    FileUploader.prototype.createToken = function () {
        return Uuid.v1();
    };
    /**
     *
     * @param file
     * @param fileName
     * @param pathToUpload
     * @param callback
     * @returns {Fs.ReadStream}
     */
    FileUploader.prototype.upload = function (file, fileName, pathToUpload, callback) {
        Mkdirp.sync(pathToUpload);
        var path = this.getUniqueFileName(Path.join(pathToUpload, fileName));
        var fileStream = Fs.createWriteStream(path);
        fileStream.on('error', function (err) {
            callback(err);
        });
        file.pipe(fileStream);
        file.on('end', function (err) {
            var ret = {
                filename: Path.parse(path).base
            };
            callback(null, ret);
        });
        return file;
    };
    /**
     *
     * @param srcDir
     * @param targetDir
     * @param callback
     */
    FileUploader.prototype.syncFiles = function (srcDir, targetDir, callback) {
        FsExtra.removeSync(targetDir);
        Mkdirp.sync(srcDir);
        Mkdirp.sync(targetDir);
        FsExtra.copySync(srcDir, targetDir);
        var files = this.getFiles(targetDir);
        callback(null, {
            'files': files
        });
    };
    /**
     *
     * @param path
     * @param callback
     */
    FileUploader.prototype.removeFile = function (path, callback) {
        return FsExtra.remove(path, callback);
    };
    /**
     *
     * @param path
     * @param thumbnails
     * @param callback
     */
    FileUploader.prototype.createThumbnails = function (path, thumbnails, callback) {
        var _this = this;
        var files = this.getFiles(path);
        return Async.eachSeries(files, function (f, _callback) {
            var file = Path.join(path, f);
            if (_this.isImage(file)) {
                Async.eachSeries(thumbnails, function (thumbnail, __callback) {
                    return _this.createThumbnail(file, path, thumbnail, __callback);
                }, function (err) {
                    return _callback(err);
                });
            }
            else {
                return _callback();
            }
        }, function (err) {
            return callback(err);
        });
    };
    /**
     *
     * @param file
     * @param targetPath
     * @param thumbnail
     * @param callback
     */
    FileUploader.prototype.createThumbnail = function (file, targetPath, thumbnail, callback) {
        if (!this.checkFileExists(file)) {
            callback('file does not exist');
        }
        else if (!this.isImage(file)) {
            callback('file is not a image');
        }
        else {
            var name_1 = thumbnail.name;
            var width = thumbnail.width;
            var height = thumbnail.height;
            var dest = Path.join(targetPath, name_1);
            var filename = Path.parse(file).base;
            var thumbnailPath = Path.join(dest, filename);
            Mkdirp.sync(dest);
            if (this.checkFileExists(thumbnailPath)) {
                callback();
            }
            else {
                Gm(file).resize(width, height).noProfile().write(thumbnailPath, function (err) {
                    callback(err);
                });
            }
        }
    };
    /**
     *
     * @param file
     * @returns {string}
     */
    FileUploader.prototype.getUniqueFileName = function (file) {
        var parseData = Path.parse(file);
        var dir = parseData.dir;
        var fileName = parseData.name;
        var ext = parseData.ext;
        var i = 1;
        while (true) {
            if (!this.checkFileExists(file)) {
                break;
            }
            file = Path.join(dir, fileName + '_' + i + ext);
            i = i + 1;
        }
        return file;
    };
    /**
     *
     * @param file
     * @returns {boolean}
     */
    FileUploader.prototype.isImage = function (file) {
        var mime = Mime.lookup(file);
        var regex = new RegExp('image/\\S+');
        if (regex.test(mime)) {
            return true;
        }
        return false;
    };
    /**
     *
     * @param file
     * @returns {boolean}
     */
    FileUploader.prototype.checkFileExists = function (file) {
        try {
            var stats = Fs.statSync(file);
            return stats.isFile();
        }
        catch (e) {
            return false;
        }
    };
    /**
     *
     * @param path
     * @returns {Array}
     */
    FileUploader.prototype.getFiles = function (path) {
        var files = Fs.readdirSync(path);
        var temp = [];
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (this.checkFileExists(Path.join(path, file))) {
                    temp.push(file);
                }
            }
        }
        return temp;
    };
    return FileUploader;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FileUploader;
