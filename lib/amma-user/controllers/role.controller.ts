import Hapi = require('hapi');
import Boom = require('boom');
import Async = require('async');
import CrudController = require('../../amma-crud-helper/lib/crud.controller');
import RoleModel = require('../services/role.model');

class RoleController extends CrudController.default<RoleModel.IRoleDocument, RoleModel.IRoleModel> {

    getService():RoleModel.IRoleModel {
        return this._server.plugins['amma-user'].roleModel;
    }

}

export default RoleController;
