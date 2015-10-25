import Hapi = require("hapi");
import Mongoose = require("mongoose");
import DbParser = require('amma-db-parser/services/db.parser');
import CrudModel = require('../../amma-crud-helper/lib/crud.model');

export interface IUserDocument extends Mongoose.Document {

}

export interface IUserModel extends CrudModel.ICrudModel <IUserDocument> {
  findByToken(token: string, next: (err?: any, result?: IUserDocument) => any): void;
  findByIdAndUpdateToken(id: string, token: string, next: (err?: any, result?: IUserDocument) => any): void;
  findByTokenAndRemoveToken(token: string, next: (err?: any, result?: IUserDocument) => any): void;
}

export default class UserModel extends CrudModel.default<IUserDocument> implements IUserModel {

  getSchema(): Mongoose.Schema {
    return this._server.plugins['amma-user'].config.options.userSchema.schema;
  }


  getCollectionName(): string {
    return this._server.plugins['amma-user'].config.options.userSchema.collectionName;
  }

  findByToken(token: string, next: (err?: any, result?: IUserDocument) => any): void {
    this.model.findOne({ token: token }).exec(next);
  }

  findByIdAndUpdateToken(id: string, token: string, next: (err?: any, results?: IUserDocument) => any): void {
    this.findById(id, (err: any, result: any) => {
      if (err) {
        next('User not found');
      }
      result.token.push(token);
      result.save(next);
    });
  }

  findByTokenAndRemoveToken(token: string, next: (err?: any, results?: any) => IUserDocument): void {
    this.findByToken(token, (err: any, result: any) => {
      if (err) {
        next('User not found');
      }
      result.token.pull(token);
      result.save(next);
    });
  }

}
