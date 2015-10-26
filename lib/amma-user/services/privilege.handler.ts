import Hapi = require("hapi");
import _ = require("lodash");
import ObjectPath = require('object-path');

export interface IPrivilege {
  name: string;
  title: string;
  group?: string;
  description?: string;
  defaultRoleAccess?: string[]|string;
}

export default class PrivilegeHandler {

  private _privileges: IPrivilege[] = [];

  constructor(protected _server: Hapi.Server) {

  }

  get privileges(): IPrivilege[] {
    if (!this._privileges.length) {
      let plugins = this._server.plugins;
      _.forEach(plugins, (plugin, key: string) => {
        let privileges = ObjectPath.get(plugin, 'config.options.privileges', []);
        this._privileges = _.union(this._privileges, privileges)
      });
    }
    return this._privileges;
  }

  get scopes(): string[] {
    let scopes: string[] = [];
    let privileges = this.privileges;
    for(let i=0; i< privileges.length; i++){
      scopes.push(privileges[i].name)
    }
    return scopes;
  }

  getScopesForDefaultRole(name:string): string[] {
    let scopes: string[] = [];
    let privileges = this.privileges;
    for(let i=0; i< privileges.length; i++){
      let privilege = privileges[i];
      if(!privilege.defaultRoleAccess){
        continue;
      }
      else if(typeof privilege.defaultRoleAccess === 'string'){
        if(name === privilege.defaultRoleAccess){
          scopes.push(privilege.name)
        }
      } else{
        if(privilege.defaultRoleAccess.indexOf(name) != -1){
          scopes.push(privilege.name)
        }
      }
    }
    return scopes;
  }

}
