import Joi = require('joi');
let PayloadValidator = require('./validations/user.payload');

let routes = [
    {
        method: 'GET',
        path: '/users',
        config: {
            handler: '%plugins.amma-user.userController.getAll%',
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
        path: '/users',
        config: {
            handler: '%plugins.amma-user.userController.create%',
            validate: {
                payload: PayloadValidator.createPayload
            }
        }
    },
    {
        method: 'GET',
        path: '/users/{id}',
        config: {
            handler: '%plugins.amma-user.userController.get%',
        }
    },
    {
        method: 'PUT',
        path: '/users/{id}',
        config: {
            handler: '%plugins.amma-user.userController.update%',
            validate: {
                payload: PayloadValidator.updatePayload
            }
        }
    },
    {
        method: 'DELETE',
        path: '/users/{id}',
        config: {
            handler: '%plugins.amma-user.userController.remove%'
        }
    },
    {
        method: 'POST',
        path: '/users/login',
        config: {
            handler: '%plugins.amma-user.userController.login%',
            validate: {
                payload: PayloadValidator.loginPayload
            }
        }
    },
    {
        method: 'GET',
        path: '/users/logout',
        config: {
            handler: '%plugins.amma-user.userController.logout%',
        }
    }
];
module.exports = routes;
