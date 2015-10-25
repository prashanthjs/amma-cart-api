import Hapi = require("hapi");
import Mongoose = require("mongoose");
import DbParser = require('amma-db-parser/services/db.parser');

export interface ICallback {
  (err?: any, results?: any): any;
}

export interface ICrudModel<IDocument extends Mongoose.Document> {
  getDbParser(): DbParser.IDbParser;
  getSchema(): Mongoose.Schema;
  getCollectionName(): string;
  model: Mongoose.Model<IDocument>;
  findAll(options: Object, next: (err?: any, results?: IDocument[]) => any): void;
  findAllCount(options: Object, next: (err?: any, results?: IDocument[]) => any): void;
  findById(id: string, next: (err?: any, result?: IDocument) => any): void;
  create(payload: IDocument, next: (err?: any, results?: any) => any): void;
  findByIdAndUpdate(id: string, payload: IDocument, next: (err?: any, results?: any) => any): void;
  findByIdAndRemove(id: string, next: (err?: any, results?: any) => any): void;
}

abstract class CrudModel<IDocument extends Mongoose.Document> implements ICrudModel<IDocument> {

  protected _model: Mongoose.Model<IDocument>;

  constructor(protected _server: Hapi.Server) {

  }

  getDbParser(): DbParser.IDbParser {
    return this._server.plugins['amma-db-parser'].dbParser.getDbParser(this.getSchema());
  }

  abstract getSchema(): Mongoose.Schema;

  abstract getCollectionName(): string;

  get model(): Mongoose.Model<IDocument> {
    if (!this._model) {
      let names = Mongoose.modelNames();
      let collectionName = this.getCollectionName();
      if (names.indexOf(collectionName) == -1) {
        this._model = Mongoose.model<IDocument>(collectionName, this.getSchema());
      } else {
        this._model = Mongoose.model<IDocument>(collectionName);
      }
    }
    return this._model;
  }

  findAll(options: Object, next: (err?: any, results?: IDocument[]) => any): void {
    let dbParser = this.getDbParser();
    dbParser.parse(options);
    this.model.find(dbParser.filter).sort(dbParser.sort).limit(dbParser.pageSize).skip(dbParser.skip).exec(next);
  }
  findAllCount(options: Object, next: (err?: any, results?: IDocument[]) => any): void {
    let dbParser = this.getDbParser();
    dbParser.parse(options);
    this.model.count(dbParser.filter).exec(next);
  }

  findById(id: string, next: (err?: any, result?: IDocument) => any): void {
    this.model.findById(id).exec(next);
  }

  create(payload: IDocument, next: (err?: any, results?: any) => any): void {
    this.model.create(payload, next);
  }

  findByIdAndUpdate(id: string, payload: IDocument, next: ICallback): void {
    this.model.findByIdAndUpdate(id, payload, { upsert: false }, next);
  }

  findByIdAndRemove(id: string, next: ICallback): void {
    this.model.findByIdAndRemove(id, next);
  }

}
export default CrudModel;
