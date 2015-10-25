module.exports = {
    'userSchema': require('./user.schema').default,
    'roleSchema': require('./role.schema').default,
    'authsecret': 'ammadaddysisterbrotherfamily123450987',
    'defaultRoles': [
        {
            id: 'guest',
            title: 'Guest'
        },
        {
            id: 'super_power_admin',
            title: 'Super Power admin'
        },
        {
            id: 'user',
            title: 'User'
        }
    ],
    fileOptions: {
        'srcDir': __dirname + '/../uploads/public/',
        'tempDir': __dirname + '/../uploads/temp/',
        'thumbnails': [
            {
                name: 'profile',
                width: 200,
                height: 200
            }
        ]
    }
};
