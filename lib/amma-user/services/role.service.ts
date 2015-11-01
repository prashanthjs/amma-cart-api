import Hapi = require("hapi");
import RoleModel = require('./role.model');
import PrivilegeHandler = require('./privilege.handler');
import Async = require('async');

export interface ICallback {
    (err?:any, results?:any): any;
}

export default class RoleService {

    constructor(protected _server:Hapi.Server) {
    }

    onPreStart(server:Hapi.Server, next:ICallback) {
        this._insertDefaultRoles(next);
    }

    private _insertDefaultRoles(next:ICallback):void {
        let roles = this._getDefaultRoles();
        let roleModel = this._getRoleModel();
        let privilegeHandler = this._getPrivilegeHandler();
        Async.eachSeries(roles, (role:any, _callback:ICallback) => {
            roleModel.findById(role._id, (err, result:any) => {
                if (err) {
                    return _callback(err);
                }
                let scopes = [];
                if (role._id === 'super_power_admin') {
                    scopes = privilegeHandler.scopes;
                } else {
                    scopes = privilegeHandler.getScopesForDefaultRole(role._id);
                }
                if (result) {
                    if (result._id == 'super_power_admin') {
                        result.privileges = scopes;
                        return result.save(_callback);
                    }
                    return _callback();
                }
                role.privileges = scopes;
                return roleModel.create(role, _callback);
            });
        }, (err:any) => {
            return next(err);
        });
    }

    private _getDefaultRoles():RoleModel.IRoleDocument[] {
        return this._server.plugins['amma-user'].config.options.defaultRoles;
    }

    private _getRoleModel():RoleModel.IRoleModel {
        return this._server.plugins['amma-user'].roleModel;
    }

    private _getPrivilegeHandler():any {
        return this._server.plugins['amma-user'].privilegeHandler;
    }

}
