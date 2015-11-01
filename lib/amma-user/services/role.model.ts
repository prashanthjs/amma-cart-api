import Hapi = require("hapi");
import Mongoose = require("mongoose");
import DbParser = require('amma-db-parser/services/db.parser');
import CrudModel = require('../../amma-crud-helper/lib/crud.model');
import Async = require('async');

export interface ICallback {
    (err?:any, results?:any): any;
}

export interface IRoleDocument extends Mongoose.Document {
    title: string;
}

export interface IRoleModel extends CrudModel.ICrudModel <IRoleDocument> {

}

export default class RoleModel extends CrudModel.default<IRoleDocument> implements IRoleModel {

    getSchema():Mongoose.Schema {
        return this._server.plugins['amma-user'].config.options.roleSchema.schema;
    }


    getCollectionName():string {
        return this._server.plugins['amma-user'].config.options.roleSchema.collectionName;
    }

}
