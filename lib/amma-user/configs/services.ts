module.exports = {
  'roleModel': require('../services/role.model').default,
  'roleService': require('../services/role.service').default,
  'userModel': require('../services/user.model').default,
  'roleController': require('../controllers/role.controller').default,
  'userController': require('../controllers/user.controller').default,
  'userProfileController': require('../controllers/user.profile.controller').default,
  'privilegeHandler': require('../services/privilege.handler').default,
  'authHandler': require('../services/auth.handler').default
}
