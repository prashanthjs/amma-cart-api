var Path = require('path');
var Async = require('async');
var Fs = require('fs');
var FileUploadHelper = (function () {
    function FileUploadHelper(fileUploader, options) {
        this.fileUploader = fileUploader;
        this.options = options;
    }
    /**
     *
     * @param extPath
     * @param callback
     */
    FileUploadHelper.prototype.createToken = function (extPath, callback) {
        var token = this.fileUploader.createToken();
        if (extPath) {
            this.syncSrcToTemp(token, extPath, function (error, results) {
                callback(error, {
                    token: token,
                    files: results.files || []
                });
            });
        }
        else {
            callback(null, {
                token: token,
                files: []
            });
        }
    };
    /**
     *
     * @param token
     * @returns {string[]}
     */
    FileUploadHelper.prototype.getFilesByToken = function (token) {
        var tempDir = this._getTempDirWithToken(token);
        return this.fileUploader.getFiles(tempDir);
    };
    /**
     *
     * @param extPath
     * @param callback
     */
    FileUploadHelper.prototype.getFilesInSrc = function (extPath, callback) {
        var srcDir = this._getSrcDirWithExt(extPath);
        var files = this._getValidFiles(srcDir);
        var result = {
            main: files
        };
        var thumbnails = this.options.thumbnails;
        if (thumbnails && thumbnails.length) {
            for (var i = 0; i < thumbnails.length; i++) {
                var name_1 = thumbnails[i].name;
                result[name_1] = this._getValidFiles(Path.join(srcDir, name_1));
            }
        }
        callback(null, result);
    };
    /**
     *
     * @param token
     * @param file
     * @param fileName
     * @param callback
     */
    FileUploadHelper.prototype.upload = function (token, file, fileName, callback) {
        var tempDir = this._getTempDirWithToken(token);
        if (!this._isValid(fileName)) {
            callback('Invalid file');
        }
        else {
            this.fileUploader.upload(file, fileName, tempDir, callback);
        }
    };
    /**
     *
     * @param token
     * @param extPath
     * @param callback
     */
    FileUploadHelper.prototype.syncTempToSrc = function (token, extPath, callback) {
        var _this = this;
        var srcDir = this._getSrcDirWithExt(extPath);
        var tempDir = this._getTempDirWithToken(token);
        Async.series({
            sync: function (next) {
                _this._sync(tempDir, srcDir, next);
            },
            thumbnails: function (next) {
                _this.fileUploader.createThumbnails(srcDir, _this.options.thumbnails, next);
            },
            removeFiles: function (next) {
                _this.fileUploader.removeFile(tempDir, next);
            }
        }, function (error, results) {
            callback(error, { files: results.sync.files });
        });
    };
    /**
     *
     * @param token
     * @param fileName
     * @param callback
     */
    FileUploadHelper.prototype.removeFile = function (token, fileName, callback) {
        var tempDir = this._getTempDirWithToken(token);
        var path = Path.join(tempDir, fileName);
        this.fileUploader.removeFile(path, callback);
    };
    /**
     *
     * @param token
     * @param extPath
     * @param callback
     */
    FileUploadHelper.prototype.syncSrcToTemp = function (token, extPath, callback) {
        var _this = this;
        var srcDir = this._getSrcDirWithExt(extPath);
        var tempDir = this._getTempDirWithToken(token);
        Async.series({
            sync: function (next) {
                _this._sync(srcDir, tempDir, next);
            }
        }, function (error, results) {
            callback(error, { files: results.sync.files });
        });
    };
    /**
     *
     * @param src
     * @param target
     * @param callback
     * @private
     */
    FileUploadHelper.prototype._sync = function (src, target, callback) {
        this.fileUploader.syncFiles(src, target, callback);
    };
    /**
     *
     * @param ext
     * @returns {string}
     * @private
     */
    FileUploadHelper.prototype._getSrcDirWithExt = function (ext) {
        return Path.join(this.options.srcDir, ext);
    };
    /**
     *
     * @param token
     * @returns {string}
     * @private
     */
    FileUploadHelper.prototype._getTempDirWithToken = function (token) {
        return Path.join(this.options.tempDir, token);
    };
    /**
     *
     * @param fileName
     * @returns {boolean}
     * @private
     */
    FileUploadHelper.prototype._isValid = function (fileName) {
        var parts = Path.parse(fileName);
        var ext = parts.ext;
        var options = this.options;
        if (options.validExtensions && options.validExtensions instanceof Array) {
            return options.validExtensions.indexOf(ext) != -1;
        }
        return true;
    };
    /**
     *
     * @param dir
     * @returns {Array}
     * @private
     */
    FileUploadHelper.prototype._getValidFiles = function (dir) {
        var files = this.fileUploader.getFiles(dir);
        var result = [];
        for (var i = 0; i < files.length; i++) {
            var filePath = Path.join(dir, files[i]);
            var isFile = Fs.lstatSync(filePath).isFile();
            if (isFile && this._isValid(files[i])) {
                result.push(files[i]);
            }
        }
        return result;
    };
    return FileUploadHelper;
})();
exports.FileUploadHelper = FileUploadHelper;
/**
 *
 */
var FileUploaderFactory = (function () {
    /**
     *
     * @param _server
     */
    function FileUploaderFactory(_server) {
        this._server = _server;
    }
    /**
     *
     * @returns {any}
     */
    FileUploaderFactory.prototype.getFileUploader = function () {
        return this._server.plugins['amma-file-upload'].fileUpload;
    };
    /**
     *
     * @param options
     * @returns {FileUploadHelper}
     */
    FileUploaderFactory.prototype.getInstance = function (options) {
        var fileUploader = this.getFileUploader();
        return new FileUploadHelper(fileUploader, options);
    };
    return FileUploaderFactory;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FileUploaderFactory;
