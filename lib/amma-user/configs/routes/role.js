var PayloadValidator = require('./validations/role.payload');
var routes = [
    {
        method: 'GET',
        path: '/roles',
        config: {
            handler: '%plugins.amma-user.roleController.getAll%',
            auth: {},
            plugins: {
                hal: {
                    embedded: {
                        result: {
                            path: 'results',
                            href: './{item._id}'
                        }
                    }
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/roles',
        config: {
            handler: '%plugins.amma-user.roleController.create%',
            validate: {
                payload: PayloadValidator.createPayload
            }
        }
    },
    {
        method: 'GET',
        path: '/roles/{id}',
        config: {
            handler: '%plugins.amma-user.roleController.get%',
        }
    },
    {
        method: 'PUT',
        path: '/roles/{id}',
        config: {
            handler: '%plugins.amma-user.roleController.update%',
            validate: {
                payload: PayloadValidator.updatePayload
            }
        }
    },
    {
        method: 'DELETE',
        path: '/roles/{id}',
        config: {
            handler: '%plugins.amma-user.roleController.remove%'
        }
    }
];
module.exports = routes;
