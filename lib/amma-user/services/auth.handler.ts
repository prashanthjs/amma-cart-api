import Hapi = require("hapi");
import _ = require("lodash");
import ObjectPath = require('object-path');
import JWT = require('jsonwebtoken');
import UserModel = require('./user.model');
import UUID = require('node-uuid');
let HapiAuthJwt = require('hapi-auth-jwt2');



export interface ICallback {
  (err?: any, results?: any): any;
}

export interface IUserToken {
  token: string
}

export default class AuthHandler {

  constructor(private _server: Hapi.Server) {
  }

  registerAuth(next) {
    this._server.register(HapiAuthJwt, (err) => {
      if (err) {
        return next(err);
      }
      this._server.auth.strategy('jwt', 'jwt', false, {
        key: this._getSecret(),
        validateFunc: this.validate,
        verifyOptions: { ignoreExpiration: true }
      });
      this._server.auth.default('jwt');
      return next();
    });
  }

  createAndAddToken(id: string, next: ICallback) {
    let token = UUID.v1();
    let userModel = this._getUserModel();
    userModel.findByIdAndUpdateToken(id, token, (err, result) => {
      if (err) {
        return next(err);
      }
      return next(null, JWT.sign({ token: token }, this._getSecret()));
    });
  }


  validate(decoded: IUserToken, request: Hapi.Request, callback: ICallback) {
    let token = ObjectPath.get(decoded, 'token', '');
    if (!token) {
      return callback(null, false);
    }
    let userModel = this._getUserModel();
    userModel.findByToken(token, (err: any, result) => {
      if (err) {
        return callback(null, false);
      }
      if (!result.isActive) {
        return callback(null, false);
      }
      return callback(null, result);
    });
  }

  private _getUserModel(): UserModel.IUserModel {
    return this._server.plugins['amma-user'].userModel;
  }

  private _getSecret(): string {
    return ObjectPath.get(this._server.plugins, 'amma-user.config.options.authsecret', '');
  }

}
