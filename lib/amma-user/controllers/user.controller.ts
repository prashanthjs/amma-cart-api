import Hapi = require("hapi");
import Boom = require("boom");
import Async = require('async');
import CrudController = require('../../amma-crud-helper/lib/crud.controller');
import UserModel = require('../services/user.model');

export default class ArticleController extends CrudController.default<UserModel.IUserDocument, UserModel.IUserModel> {

  getService(): UserModel.IUserModel {
    return this._server.plugins['amma-user'].userModel;
  }

}
