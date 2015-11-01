var Joi = require('joi');
module.exports = [
    {
        method: 'GET',
        path: '/users/get-image-with-token/{id?}',
        config: {
            handler: '%plugins.amma-user.userProfileController.getImagesWithToken%',
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
                maxBytes: 1048576 * 10,
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
        method: 'GET',
        path: '/users/{id}/images',
        config: {
            handler: '%plugins.amma-user.userProfileController.getImages%',
        }
    },
    {
        method: 'DELETE',
        path: '/users/remove-file/{token}/{fileName}',
        config: {
            handler: '%plugins.amma-user.userProfileController.removeFile%'
        }
    }
];
