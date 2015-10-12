import Hapi = require("hapi");
import Boom = require("boom");
import Async = require('async');
import CrudController = require('amma-crud-helper/lib/crud.controller');
import ArticleModel = require('../services/article.model');

export default class ArticleController extends CrudController.default<ArticleModel.IArticleDocument, ArticleModel.IArticleModel> {

  getService(): ArticleModel.IArticleModel {
    return this._server.plugins['amma-article'].articleModel;
  }

}
