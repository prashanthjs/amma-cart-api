import AmmaFileUpload = require('./file-upload');
import Path = require('path');
import Async = require('async');
import Fs = require('fs');
import Hapi = require('hapi');

export interface Ioptions {
    tempDir: string;
    srcDir: string;
    thumbnails?: AmmaFileUpload.IThumbnail[],
    validExtensions?: string[]
}

export interface ICallback {
    (err?:any, results?:any): any;
}
export class FileUploadHelper {

    constructor(public fileUploader:AmmaFileUpload.IFileUploader, public options:Ioptions) {

    }

    /**
     *
     * @param extPath
     * @param callback
     */
    createToken(extPath:string, callback:ICallback):void {
        let token = this.fileUploader.createToken();
        if (extPath) {
            this.syncSrcToTemp(token, extPath, (error, results) => {
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
    }

    /**
     *
     * @param token
     * @returns {string[]}
     */
    getFilesByToken(token:string):string[] {
        let tempDir = this._getTempDirWithToken(token);
        return this.fileUploader.getFiles(tempDir);
    }

    /**
     *
     * @param extPath
     * @param callback
     */
    getFilesInSrc(extPath:string, callback:ICallback):void {
        let srcDir = this._getSrcDirWithExt(extPath);
        let files = this._getValidFiles(srcDir);
        let result = {
            main: files
        };
        let thumbnails = this.options.thumbnails;
        if (thumbnails && thumbnails.length) {
            for (let i = 0; i < thumbnails.length; i++) {
                let name = thumbnails[i].name;
                result[name] = this._getValidFiles(Path.join(srcDir, name));
            }
        }
        callback(null, result);
    }

    /**
     *
     * @param token
     * @param file
     * @param fileName
     * @param callback
     */
    upload(token:string, file:Fs.ReadStream, fileName:string, callback:ICallback):void {
        let tempDir = this._getTempDirWithToken(token);
        if (!this._isValid(fileName)) {
            callback('Invalid file');
        }
        else {
            this.fileUploader.upload(file, fileName, tempDir, callback);
        }
    }

    /**
     *
     * @param token
     * @param extPath
     * @param callback
     */
    syncTempToSrc(token:string, extPath:string, callback:ICallback):void {
        let srcDir = this._getSrcDirWithExt(extPath);
        let tempDir = this._getTempDirWithToken(token);
        Async.series({
            sync: (next) => {
                this._sync(tempDir, srcDir, next);
            },
            thumbnails: (next) => {
                this.fileUploader.createThumbnails(srcDir, this.options.thumbnails, next);
            },
            removeFiles: (next) => {
                this.fileUploader.removeFile(tempDir, next);
            }
        }, (error:any, results:any) => {
            callback(error, {files: results.sync.files});
        });
    }

    /**
     *
     * @param token
     * @param fileName
     * @param callback
     */
    removeFile(token, fileName, callback:ICallback) {
        let tempDir = this._getTempDirWithToken(token);
        let path = Path.join(tempDir, fileName);
        this.fileUploader.removeFile(path, callback);
    }

    /**
     *
     * @param token
     * @param extPath
     * @param callback
     */
    syncSrcToTemp(token:string, extPath:string, callback:ICallback):void {
        let srcDir = this._getSrcDirWithExt(extPath);
        let tempDir = this._getTempDirWithToken(token);
        Async.series({
            sync: (next) => {
                this._sync(srcDir, tempDir, next);
            }
        }, (error:any, results:any) => {
            callback(error, {files: results.sync.files});
        });
    }

    /**
     *
     * @param src
     * @param target
     * @param callback
     * @private
     */
    protected _sync(src:string, target:string, callback:ICallback) {
        this.fileUploader.syncFiles(src, target, callback);
    }

    /**
     *
     * @param ext
     * @returns {string}
     * @private
     */
    protected _getSrcDirWithExt(ext:string):string {
        return Path.join(this.options.srcDir, ext);
    }

    /**
     *
     * @param token
     * @returns {string}
     * @private
     */
    protected _getTempDirWithToken(token:string):string {
        return Path.join(this.options.tempDir, token);
    }

    /**
     *
     * @param fileName
     * @returns {boolean}
     * @private
     */
    protected _isValid(fileName:string):boolean {
        let parts = Path.parse(fileName);
        let ext = parts.ext;
        let options = this.options;
        if (options.validExtensions && options.validExtensions instanceof Array) {
            return options.validExtensions.indexOf(ext) != -1;
        }
        return true;
    }

    /**
     *
     * @param dir
     * @returns {Array}
     * @private
     */
    protected _getValidFiles(dir:string):string[] {
        let files = this.fileUploader.getFiles(dir);
        let result = [];
        for (let i = 0; i < files.length; i++) {
            let filePath = Path.join(dir, files[i]);
            let isFile = Fs.lstatSync(filePath).isFile();
            if (isFile && this._isValid(files[i])) {
                result.push(files[i]);
            }
        }
        return result;
    }

}
/**
 *
 */
class FileUploaderFactory {
    /**
     *
     * @param _server
     */
    constructor(public _server:Hapi.Server) {

    }

    /**
     *
     * @returns {any}
     */
    getFileUploader():AmmaFileUpload.IFileUploader {
        return this._server.plugins['amma-file-upload'].fileUpload;
    }

    /**
     *
     * @param options
     * @returns {FileUploadHelper}
     */
    getInstance(options:Ioptions):FileUploadHelper {
        let fileUploader = this.getFileUploader();
        return new FileUploadHelper(fileUploader, options);
    }

}

export default FileUploaderFactory;


