module.exports = {
  'userSchema': require('./user.schema').default,
  'roleSchema': require('./role.schema').default,
  'authsecret': 'ammadaddysisterbrotherfamily123450987',
  'privileges':[
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
