var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Boom = require("boom");
var CrudController = require('../../amma-crud-helper/lib/crud.controller');
var ObjectPath = require('object-path');
var ArticleController = (function (_super) {
    __extends(ArticleController, _super);
    function ArticleController() {
        _super.apply(this, arguments);
    }
    ArticleController.prototype.getService = function () {
        return this._server.plugins['amma-user'].userModel;
    };
    ArticleController.prototype.getAuthHandlerService = function () {
        return this._server.plugins['amma-user'].authHandler;
    };
    ArticleController.prototype.login = function (request, reply) {
        var username = ObjectPath.get(request, 'payload._id', '');
        var password = ObjectPath.get(request, 'payload.password', '');
        this.getAuthHandlerService().login(username, password, function (err, result) {
            if (err) {
                reply(Boom.unauthorized(err));
            }
            else {
                reply(result);
            }
        });
    };
    ArticleController.prototype.logout = function (request, reply) {
        var token = ObjectPath.get(request, 'headers.authorization', '');
        this.getAuthHandlerService().logout(token, function (err, result) {
            reply({ success: true });
        });
    };
    return ArticleController;
})(CrudController.default);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArticleController;
