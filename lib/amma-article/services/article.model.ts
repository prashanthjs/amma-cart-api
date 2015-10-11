import Hapi = require("hapi");
import Mongoose = require("mongoose");
import DbParser = require('amma-db-parser/services/db.parser');

export interface IArticleDocument extends Mongoose.Document {
  title: string;
}

export interface IArticleModel {
    getDbParser(): DbParser.IDbParser;
    getSchema(): Mongoose.Schema;
    getCollectionName(): string;
    model: Mongoose.Model<IArticleDocument>;
    findAll(options: Object, next: (err?: any, results?: IArticleDocument[]) => any): void;
    findAllCount(options: Object, next: (err?: any, results?: IArticleDocument[]) => any): void;
    findById(id: string, next: (err?: any, result?: IArticleDocument) => any): void;
    create(payload: IArticleDocument, next: (err?: any, results?: any) => any): void;
    findByIdAndUpdate(id: string, payload: IArticleDocument, next: (err?: any, results?: any) => any): void;
    findByIdAndRemove(id: string, next: (err?: any, results?: any) => any): void;
}

export default class ArticleModel {

  public static _model: Mongoose.Model<IArticleDocument>;

  constructor(private _server: Hapi.Server) {

  }

  getDbParser(): DbParser.IDbParser {
    return this._server.plugins['amma-db-parser'].dbParser.getDbParser(this.getSchema());
  }

  getSchema(): Mongoose.Schema {
    return this._server.plugins['amma-article'].config.options.articleSchema.schema;
  }


  getCollectionName(): string {
    return this._server.plugins['amma-article'].config.options.articleSchema.collectionName;
  }

  get model(): Mongoose.Model<IArticleDocument> {
    if (!ArticleModel._model) {
      ArticleModel._model = Mongoose.model<IArticleDocument>(this.getCollectionName(), this.getSchema());
    }
    return ArticleModel._model;
  }

  findAll(options: Object, next: (err?: any, results?: IArticleDocument[]) => any): void {
    let dbParser = this.getDbParser();
    dbParser.parse(options);
    this.model.find(dbParser.filter).sort(dbParser.sort).limit(dbParser.pageSize).skip(dbParser.skip).exec(next);
  }
  findAllCount(options: Object, next: (err?: any, results?: IArticleDocument[]) => any): void {
    let dbParser = this.getDbParser();
    dbParser.parse(options);
    this.model.count(dbParser.filter).exec(next);
  }

  findById(id: string, next: (err?: any, result?: IArticleDocument) => any): void {
    this.model.findById(id).exec(next);
  }

  create(payload: IArticleDocument, next: (err?: any, results?: any) => any): void {
    this.model.create(payload, next);
  }

  findByIdAndUpdate(id: string, payload: IArticleDocument, next: (err?: any, results?: any) => any): void {
    this.model.findByIdAndUpdate(id, payload, { upsert: false }, next);
  }

  findByIdAndRemove(id: string, next: (err?: any, results?: any) => any): void {
    this.model.findByIdAndRemove(id, next);
  }

}
