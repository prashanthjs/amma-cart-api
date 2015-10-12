import Hapi = require("hapi");
import Mongoose = require("mongoose");
import DbParser = require('amma-db-parser/services/db.parser');
import CrudModel = require('amma-crud-helper/lib/crud.model');

export interface IArticleDocument extends Mongoose.Document {
  title: string;
}

export interface IArticleModel extends CrudModel.ICrudModel <IArticleDocument>{

}

export default class ArticleModel extends CrudModel.default<IArticleDocument> implements IArticleModel {

  getSchema(): Mongoose.Schema {
    return this._server.plugins['amma-article'].config.options.articleSchema.schema;
  }


  getCollectionName(): string {
    return this._server.plugins['amma-article'].config.options.articleSchema.collectionName;
  }

}
