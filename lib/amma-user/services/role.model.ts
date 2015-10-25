import Hapi = require("hapi");
import Mongoose = require("mongoose");
import DbParser = require('amma-db-parser/services/db.parser');
import CrudModel = require('../../amma-crud-helper/lib/crud.model');

export interface IRoleOption {
  id: string,
  title: string
}
export interface IRoleDocument extends Mongoose.Document {

}

export interface IRoleModel extends CrudModel.ICrudModel <IRoleDocument> {

}

export default class RoleModel extends CrudModel.default<IRoleDocument> implements IRoleModel {

  getSchema(): Mongoose.Schema {
    return this._server.plugins['amma-user'].config.options.roleSchema.schema;
  }


  getCollectionName(): string {
    return this._server.plugins['amma-user'].config.options.roleSchema.collectionName;
  }

  getDefaultRoles(): IRoleOption[] {
    return this._server.plugins['amma-user'].config.options.defaultRoles;
  }

  registerListeners() {

  }


}
