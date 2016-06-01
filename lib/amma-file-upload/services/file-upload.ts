import Hapi = require("hapi");
import Boom = require("boom");
import Async = require('async');
import Fs = require('fs');
import Mkdirp = require('mkdirp');
import Path = require('path');
import FsExtra = require('fs-extra');
import Gm = require('gm');
import Mime = require('mime');
import Uuid = require('node-uuid');
export interface IThumbnail {
    name: string;
    width: number;
    height?: number;
}
export interface ICallback {
    (err?:any, results?:any): any;
}

export interface IFileUploader {
    createToken(): string;
    upload(file:Fs.ReadStream, fileName:string, pathToUpload:string, callback:ICallback): Fs.ReadStream;
    syncFiles(srcDir:string, targetDir:string, callback:ICallback): any;
    removeFile(path:any, callback:(err?:any, results?:any) => any): any;
    createThumbnails(path:string, thumbnails:IThumbnail[], callback:ICallback): any;
    createThumbnail(file:string, targetPath:string, thumbnail:IThumbnail, callback:ICallback): any;
    getUniqueFileName(file:string): string;
    isImage(file:string): boolean;
    checkFileExists(file:string): boolean;
    getFiles(path:string): string[];
}

class FileUploader implements IFileUploader {

    /**
     *
     * @returns {string}
     */
    createToken():string {
        return Uuid.v1();
    }

    /**
     *
     * @param file
     * @param fileName
     * @param pathToUpload
     * @param callback
     * @returns {Fs.ReadStream}
     */
    upload(file:Fs.ReadStream, fileName:string, pathToUpload:string, callback:ICallback):Fs.ReadStream {
        Mkdirp.sync(pathToUpload);
        let path = this.getUniqueFileName(Path.join(pathToUpload, fileName));
        let fileStream = Fs.createWriteStream(path);
        fileStream.on('error', (err) => {
            callback(err);
        });
        file.pipe(fileStream);
        file.on('end', (err) => {
            let ret = {
                filename: Path.parse(path).base
            };
            callback(null, ret);
        });
        return file;
    }

    /**
     *
     * @param srcDir
     * @param targetDir
     * @param callback
     */
    syncFiles(srcDir:string, targetDir:string, callback:ICallback):any {
        FsExtra.removeSync(targetDir);
        Mkdirp.sync(srcDir);
        Mkdirp.sync(targetDir);
        FsExtra.copySync(srcDir, targetDir);
        let files = this.getFiles(targetDir);
        callback(null, {
            'files': files
        });
    }

    /**
     *
     * @param path
     * @param callback
     */
    removeFile(path, callback:(err?:any, results?:any) => any) {
        return FsExtra.remove(path, callback);
    }

    /**
     *
     * @param path
     * @param thumbnails
     * @param callback
     */
    createThumbnails(path:string, thumbnails:IThumbnail[], callback:ICallback):any {
        let files = this.getFiles(path);
        return Async.eachSeries(files,
            (f:string, _callback:ICallback) => {
                var file = Path.join(path, f);
                if (this.isImage(file)) {
                    Async.eachSeries(
                        thumbnails,
                        (thumbnail:IThumbnail, __callback:ICallback) => {
                            return this.createThumbnail(file, path, thumbnail, __callback);
                        },
                        (err:any) => {
                            return _callback(err);
                        });
                } else {
                    return _callback();
                }
            },
            (err:any) => {
                return callback(err);
            });
    }

    /**
     *
     * @param file
     * @param targetPath
     * @param thumbnail
     * @param callback
     */
    createThumbnail(file:string, targetPath:string, thumbnail:IThumbnail, callback:ICallback):any {

        if (!this.checkFileExists(file)) {
            callback('file does not exist');
        }
        else if (!this.isImage(file)) {
            callback('file is not a image');
        } else {
            let name = thumbnail.name;
            let width = thumbnail.width;
            let height = thumbnail.height;
            let dest = Path.join(targetPath, name);
            let filename = Path.parse(file).base;
            let thumbnailPath = Path.join(dest, filename);
            Mkdirp.sync(dest);
            if (this.checkFileExists(thumbnailPath)) {
                callback();
            } else {
                Gm(file).resize(width, height).noProfile().write(thumbnailPath, (err)  => {
                    callback(err);
                });
            }
        }

    }

    /**
     *
     * @param file
     * @returns {string}
     */
    getUniqueFileName(file:string):string {
        let parseData = Path.parse(file);
        let dir = parseData.dir;
        let fileName = parseData.name;
        let ext = parseData.ext;
        let i = 1;
        while (true) {
            if (!this.checkFileExists(file)) {
                break;
            }
            file = Path.join(dir, fileName + '_' + i + ext);
            i = i + 1;
        }
        return file;
    }

    /**
     *
     * @param file
     * @returns {boolean}
     */
    isImage(file:string):boolean {
        let mime = Mime.lookup(file);
        let regex = new RegExp('image/\\S+');
        if (regex.test(mime)) {
            return true;
        }
        return false;
    }

    /**
     *
     * @param file
     * @returns {boolean}
     */
    checkFileExists(file:string):boolean {
        try {
            let stats = Fs.statSync(file);
            return stats.isFile();
        }
        catch (e) {
            return false;
        }
    }

    /**
     *
     * @param path
     * @returns {Array}
     */
    getFiles(path:string):string[] {
        let files = Fs.readdirSync(path);
        let temp = [];
        if (files && files.length) {
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                if (this.checkFileExists(Path.join(path, file))) {
                    temp.push(file);
                }
            }
        }
        return temp;
    }

}

export default FileUploader;