import Hapi = require("hapi");
import _ = require("lodash");
import ObjectPath = require('object-path');
import JWT = require('jsonwebtoken');
import UserModel = require('./user.model');
import RoleModel = require('./role.model');
import UUID = require('node-uuid');
let HapiAuthJwt = require('hapi-auth-jwt2');



export interface ICallback {
  (err?: any, results?: any): any;
}

export interface IUserToken {
  token: string
}

export default class AuthHandler {
  private _guestToken: string;

  constructor(private _server: Hapi.Server) {
  }

  registerAuth(next) {
    this._server.register(HapiAuthJwt, (err) => {
      this._guestToken = this.createGuestToken();
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

  createGuestToken(): string {
    let token = 'guest';
    return JWT.sign({ token: token }, this._getSecret());
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
    let userModel = this._getUserModel();
    let roleModel = this._getRoleModel();
    if (!token) {
      callback(null, false);
    }
    else if (token === 'guest') {
      roleModel.findById('guest', (err, result: any) => {
        if (err) {
          return callback(null, true);
        }
        return callback(null, { scope: result.privileges });
      });
    }
    else {
      userModel.findByToken(token, (err: any, result) => {
        if (err) {
          callback(null, false);
        }
        else if (!result || !result.isActive) {
          callback(null, false);
        }
        else {
          roleModel.findById(result.role, (err, result: any) => {
            if (!err) {
              result.scope = result.privileges;
            }
            return callback(null, result);
          });
        }
      });
    }
  }

  onRequest(request: Hapi.Request, reply: Hapi.IReply) {
    let authToken = ObjectPath.get(request.headers, 'authorization', null);
    if (!authToken) {
      ObjectPath.set(request.headers, 'authorization', this._guestToken);
    }
    reply.continue();
  }

  private _getUserModel(): UserModel.IUserModel {
    return this._server.plugins['amma-user'].userModel;
  }

  private _getRoleModel(): RoleModel.IRoleModel {
    return this._server.plugins['amma-user'].roleModel;
  }

  private _getSecret(): string {
    return ObjectPath.get(this._server.plugins, 'amma-user.config.options.authsecret', '');
  }

}
