var Boom = require("boom");
var UserProfileController = (function () {
    function UserProfileController(_server) {
        this._server = _server;
    }
    UserProfileController.prototype.getService = function () {
        if (!this._fileUploadHelper) {
            this._fileUploadHelper = this._server.plugins['amma-file-upload'].fileUploadHelper.get(this.getOptions());
        }
        return this._fileUploadHelper;
    };
    UserProfileController.prototype.getOptions = function () {
        return this._server.plugins['amma-user'].config.options.fileOptions;
    };
    UserProfileController.prototype.getImagesWithToken = function (request, reply) {
        var service = this.getService();
        var id = request.params.id;
        service.getFilesWithToken(id, reply);
    };
    UserProfileController.prototype.getImages = function (request, reply) {
        var service = this.getService();
        var id = request.params.id;
        service.getFiles(id, function (err, result) {
            reply({
                files: result
            });
        });
    };
    UserProfileController.prototype.upload = function (request, reply) {
        var data = request.payload;
        var service = this.getService();
        var token = request.params.token;
        service.upload(token, data.file, data.file.hapi.filename, function (error, result) {
            if (error) {
                return reply(Boom.badData(error));
            }
            var ret = {
                filename: result.filename,
                headers: data.file.hapi.headers
            };
            return reply(ret);
        });
    };
    UserProfileController.prototype.save = function (request, reply) {
        var service = this.getService();
        var token = request.params.token;
        var id = request.params.id;
        this.saveFiles(id, token, function () {
            reply({
                success: true
            });
        });
    };
    UserProfileController.prototype.saveFiles = function (id, token, callback) {
        var service = this.getService();
        service.syncTempToSrc(token, id, callback);
    };
    UserProfileController.prototype.removeFile = function (request, reply) {
        var service = this.getService();
        var token = request.params.token;
        var fileName = request.params.fileName;
        service.removeFile(token, fileName, function () {
            return reply({
                success: true
            });
        });
    };
    return UserProfileController;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserProfileController;
