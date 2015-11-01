import Hapi = require('hapi');
import UserModel = require('./user.model');
import Async = require('async');

export interface ICallback {
    (err?:any, results?:any): any;
}

class UserService {

    constructor(protected _server:Hapi.Server) {
    }

    onPreStart(server:Hapi.Server, next:ICallback) {
        this._insertDefaultUsers(next);
    }

    private _insertDefaultUsers(next:ICallback):void {
        let users = this._getDefaultUsers();
        let userModel = this._getUserModel();
        Async.eachSeries(users, (user:any, _callback:ICallback) => {
            userModel.findById(user._id, (err, userDoc:UserModel.IUserDocument) => {
                if (err || userDoc) {
                    _callback(err);
                } else {
                    userModel.create(user, _callback);
                }
            });
        }, (err:any) => {
            return next(err);
        });
    }

    private _getUserModel():UserModel.IUserModel {
        return this._server.plugins['amma-user'].userModel;
    }

    private _getDefaultUsers():UserModel.IUserDocument[] {
        return this._server.plugins['amma-user'].config.options.defaultUsers;
    }

}

export default UserService;
