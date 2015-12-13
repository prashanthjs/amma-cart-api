import Hapi = require("hapi");
import Boom = require("boom");
import Async = require('async');
import Fs = require('fs');
import Path = require('path');
import AmmaFileUploadHelper = require('amma-file-upload/services/file-upload-helper');

export interface IRequest extends Hapi.IRequestHandler<Hapi.Request> {
    params: {
        id?: string,
        fileName?: string,
        token?: string
    },
    payload?: any
}

export default class UserProfileController {

    private _fileUploadHelper:AmmaFileUploadHelper.FileUploadHelper;

    constructor(private _server:Hapi.Server) {

    }

    getService():AmmaFileUploadHelper.FileUploadHelper {
        if (!this._fileUploadHelper) {
            this._fileUploadHelper = this._server.plugins['amma-file-upload'].fileUploadHelper.get(this.getOptions());
        }
        return this._fileUploadHelper;
    }

    public getOptions():AmmaFileUploadHelper.Ioptions {
        return this._server.plugins['amma-user'].config.options.fileOptions;
    }

    createToken(request:IRequest, reply:Hapi.IReply):any {
        let service = this.getService();
        let id = request.params.id;
        service.createToken(id, reply);
    }

    getImagesUsingToken(request:IRequest, reply:Hapi.IReply):any {
        let service = this.getService();
        let token = request.params.token;
        let files = service.getFilesByToken(token);
        reply({
            files: files
        });
    }

    getImages(request:IRequest, reply:Hapi.IReply):any {
        let service = this.getService();
        let id = request.params.id;
        service.getFiles(id, function (err, result) {
            reply({
                files: result
            });
        });
    }

    upload(request:IRequest, reply:Hapi.IReply) {
        let data = request.payload;
        let service = this.getService();
        let token = request.params.token;
        service.upload(token, data.file, data.file.hapi.filename, function (error, result) {
            if (error) {
                return reply(Boom.badData(error));
            }
            let ret = {
                filename: result.filename,
                headers: data.file.hapi.headers
            };
            return reply(ret);
        });
    }

    save(request:IRequest, reply:Hapi.IReply):any {
        let token = request.params.token;
        let id = request.params.id;
        this.saveFiles(id, token, () => {
            reply({
                success: true
            });
        })
    }

    saveFiles(id:string, token:string, callback) {
        let service = this.getService();
        service.syncTempToSrc(token, id, callback);
    }

    removeFile(request:IRequest, reply:Hapi.IReply):any {
        let service = this.getService();
        let token = request.params.token;
        let fileName = request.params.fileName;
        service.removeFile(token, fileName, function () {
            return reply({
                success: true
            });
        });
    }
}
