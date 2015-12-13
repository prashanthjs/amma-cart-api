import Joi = require('joi');
import Path = require('path');
module.exports = [
    {
        method: 'GET',
        path: '/users/create-token/{id?}',
        config: {
            handler: '%plugins.amma-user.userProfileController.createToken%',
        }
    },
    {
        method: 'GET',
        path: '/users/get-images-using-token/{token}',
        config: {
            handler: '%plugins.amma-user.userProfileController.getImagesUsingToken%',
        }
    },
    {
        method: 'POST',
        path: '/users/upload-image/{token}',
        config: {
            handler: '%plugins.amma-user.userProfileController.upload%',
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: 1048576 * 10, // 10MB
            },
            validate: {
                payload: {
                    file: Joi.object().required()
                }
            },
        }
    },
    {
        method: 'GET',
        path: '/users/{id}/save/{token}',
        config: {
            handler: '%plugins.amma-user.userProfileController.save%',
        }
    },
    {
        method: 'DELETE',
        path: '/users/remove-file/{token}/{fileName}',
        config: {
            handler: '%plugins.amma-user.userProfileController.removeFile%'
        }
    },

    {
        method: 'GET',
        path: '/users/get-image-using-token/{param*}',
        config: {
            handler: {
                directory: {
                    path: '/var/www/hapi/amma-cart-api/lib/amma-user/uploads/temp'
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/users/{id}/images',
        config: {
            handler: '%plugins.amma-user.userProfileController.getImages%',
        }
    }
];
