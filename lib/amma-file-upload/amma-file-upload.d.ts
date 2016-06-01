declare module 'amma-file-upload/index' {
	import Plugin = require('amma-plugin-loader'); let plugin: Plugin.IPluginLoader;
	export = plugin;

}
declare module 'amma-file-upload/services/file-upload' {
	import Fs = require('fs');
	export interface IThumbnail {
	    name: string;
	    width: number;
	    height?: number;
	}
	export interface ICallback {
	    (err?: any, results?: any): any;
	}
	export interface IFileUploader {
	    createToken(): string;
	    upload(file: Fs.ReadStream, fileName: string, pathToUpload: string, callback: ICallback): Fs.ReadStream;
	    syncFiles(srcDir: string, targetDir: string, callback: ICallback): any;
	    removeFile(path: any, callback: (err?: any, results?: any) => any): any;
	    createThumbnails(path: string, thumbnails: IThumbnail[], callback: ICallback): any;
	    createThumbnail(file: string, targetPath: string, thumbnail: IThumbnail, callback: ICallback): any;
	    getUniqueFileName(file: string): string;
	    isImage(file: string): boolean;
	    checkFileExists(file: string): boolean;
	    getFiles(path: string): string[];
	}
	export default class FileUploader implements IFileUploader {
	    createToken(): string;
	    upload(file: Fs.ReadStream, fileName: string, pathToUpload: string, callback: ICallback): Fs.ReadStream;
	    syncFiles(srcDir: string, targetDir: string, callback: ICallback): any;
	    removeFile(path: any, callback: (err?: any, results?: any) => any): void;
	    createThumbnails(path: string, thumbnails: IThumbnail[], callback: ICallback): any;
	    createThumbnail(file: string, targetPath: string, thumbnail: IThumbnail, callback: ICallback): any;
	    getUniqueFileName(file: string): string;
	    isImage(file: string): boolean;
	    checkFileExists(file: string): boolean;
	    getFiles(path: string): string[];
	}

}
declare module 'amma-file-upload/services/file-upload-helper' {
	import AmmaFileUpload = require('amma-file-upload/services/file-upload');
	import Fs = require('fs');
	import Hapi = require('hapi');
	export interface Ioptions {
	    tempDir: string;
	    srcDir: string;
	    thumbnails?: AmmaFileUpload.IThumbnail[];
	    validExtensions?: string[];
	}
	export interface ICallback {
	    (err?: any, results?: any): any;
	}
	export class FileUploadHelper {
	    fileUploader: AmmaFileUpload.IFileUploader;
	    options: Ioptions;
	    constructor(fileUploader: AmmaFileUpload.IFileUploader, options: Ioptions);
		createToken(extPath: string, callback: ICallback): void;
		getFilesByToken(token: string): string[];
	    getFilesWithToken(extPath: string, callback: ICallback): void;
	    getFiles(extPath: string, callback: ICallback): void;
	    upload(token: string, file: Fs.ReadStream, fileName: string, callback: ICallback): void;
	    syncTempToSrc(token: string, extPath: string, callback: ICallback): void;
	    removeFile(token: any, fileName: any, callback: ICallback): void;
	    syncSrcToTemp(token: string, extPath: string, callback: ICallback): void;
	    protected sync(src: string, target: string, callback: ICallback): any;
	    protected getSrcDirWithExt(ext: string): string;
	    protected getTempDirWithToken(token: string): string;
	    protected isValid(fileName: any): boolean;
	    protected getValidFiles(dir: any): any[];
	}
	export default class FileUploaderFactory {
	    _server: Hapi.Server;
	    constructor(_server: Hapi.Server);
	    getFileUploader(): AmmaFileUpload.IFileUploader;
	    get(options: Ioptions): FileUploadHelper;
	}

}
declare module 'amma-file-upload' {
	import main = require('amma-file-upload/index');
	export = main;
}
