import Hapi = require("hapi");
import Boom = require("boom");
import Async = require('async');

import CrudController = require('../../amma-crud-helper/lib/crud.controller');
import UserModel = require('../services/user.model');
import AuthHandler = require('../services/auth.handler');
import ObjectPath = require('object-path');


export default class ArticleController extends CrudController.default<UserModel.IUserDocument, UserModel.IUserModel> {

    getService():UserModel.IUserModel {
        return this._server.plugins['amma-user'].userModel;
    }

    getAuthHandlerService():AuthHandler.IAuthHandler {
        return this._server.plugins['amma-user'].authHandler;
    }

    login(request:Hapi.Request, reply:Hapi.IReply):void {
        let username = ObjectPath.get(request, 'payload._id', '');
        let password = ObjectPath.get(request, 'payload.password', '');
        this.getAuthHandlerService().login(username, password, (err, result) => {
            if (err) {
                reply(Boom.unauthorized(err));
            } else {
                reply(result);
            }
        });
    }

    logout(request:Hapi.Request, reply:Hapi.IReply) {
        let token = ObjectPath.get(request, 'headers.authorization', '');
        this.getAuthHandlerService().logout(token, (err, result) => {
            reply({success: true});
        });

    }

}
