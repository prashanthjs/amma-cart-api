module.exports = {
    'userSchema': require('./user.schema').default,
    'roleSchema': require('./role.schema').default,
    'authsecret': 'ammadaddysisterbrotherfamily123450987',
    'hash': 8,
    'privileges': [
        {
            name: 'user-add',
            title: 'add user'
        }
    ],
    'defaultRoles': [
        {
            _id: 'guest',
            title: 'Guest',
            privileges: []
        },
        {
            _id: 'super_power_admin',
            title: 'Super Power admin',
            privileges: []
        },
        {
            _id: 'user',
            title: 'User',
            privileges: []
        }
    ],
    defaultUsers: [
        {
            _id: 'admin',
            name: {
                firstName: 'admin',
                lastName: 'admin'
            },
            password: 'test123',
            email: 'admin@outlook.com',
            contactNumber: '07889286992',
            dob: '1988-01-05',
            gender: 'male',
            address:{
                addressLine1: '150 paget street',
                town: 'Loughborough',
                county: 'Leicestershire',
                postcode: 'LE11 5DU',
                country: 'UK'
            },
            role: 'super_power_admin',
            isActive: true
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
