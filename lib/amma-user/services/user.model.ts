import Hapi = require("hapi");
import Mongoose = require("mongoose");
import DbParser = require('amma-db-parser/services/db.parser');
import CrudModel = require('../../amma-crud-helper/lib/crud.model');
import Bcrypt = require('bcrypt');
import {ICallback} from "../../../node_modules/amma-file-upload/services/file-upload";

export interface IUserDocument extends Mongoose.Document {
    password: string;
}

export interface IUserModel extends CrudModel.ICrudModel <IUserDocument> {
    findByToken(token:string, next:(err?:any, result?:IUserDocument) => any): void;
    findByIdAndUpdateToken(id:string, token:string, next:(err?:any, result?:IUserDocument) => any): void;
    findByTokenAndRemove(token:string, next:(err?:any, result?:IUserDocument) => any): void;
    canLogin(id:string, password:string, callback:ICallback):void;
}

export default class UserModel extends CrudModel.default<IUserDocument> implements IUserModel {

    getSchema():Mongoose.Schema {
        return this._server.plugins['amma-user'].config.options.userSchema.schema;
    }


    getCollectionName():string {
        return this._server.plugins['amma-user'].config.options.userSchema.collectionName;
    }

    findByToken(token:string, next:(err?:any, result?:IUserDocument) => any):void {
        this.model.findOne({token: token}).exec(next);
    }

    findByIdAndUpdateToken(id:string, token:string, next:(err?:any, results?:IUserDocument) => any):void {
        this.findById(id, (err:any, result:any) => {
            if (err) {
                next(err);
            }
            else if(result) {
                if(!result.token){
                    result.token = [];
                }
                result.token.push(token);
                result.save(next);
            }
            else{
                next();
            }
        });
    }

    findByTokenAndRemove(token:string, next:(err?:any, results?:any) => IUserDocument):void {
        this.findByToken(token, (err:any, result:any) => {
            if (err) {
                next('User not found');
            }
            result.token.pull(token);
            result.save(next);
        });
    }


    create(payload:IUserDocument, next:(err?:any, results?:any) => any):void {
        Bcrypt.hash(payload.password, this._getHash(), (err, hash:string) => {
            if (err) {
                next(err);
            }
            else {
                payload.password = hash;
                super.create(payload, next);
            }
        });
    }

    canLogin(id:string, password:string, callback:ICallback) {
        this.model.findById(id).select('+password').exec((err, result:any) => {
            if (err) {
                callback(err);
            }
            else if (!result) {
                callback('user not found');
            }
            else if (!result.isActive) {
                return callback('user not active');
            }
            else {
                Bcrypt.compare(password, result.password, (err:any, res:boolean) => {
                    if (err) {
                        callback(err);
                    }
                    else if (!res) {
                        callback('invalid credentials');
                    }
                    else {
                        callback(null, result);
                    }
                });
            }

        });
    }

    findByIdAndUpdatePassword(id:string, password:string, next:(err?:any, result?:IUserDocument) => any):void {
        this.findById(id, (err:any, result:any) => {
            if (err || !result) {
                next('User not found');
            }
            Bcrypt.hash(password, this._getHash(), (err, hash:string) => {
                if (err) {
                    next(err);
                }
                else {
                    result.password = hash;
                    result.save(next);
                }
            });
        });
    }

    private _getHash() {
        return this._server.plugins['amma-user'].config.options.hash;
    }

}
