module.exports = [{
    type: 'onPreStart',
    method: '%plugins.amma-user.roleService.onPreStart%',
}, {
    type: 'onRequest',
    method: '%plugins.amma-user.authHandler.onRequest%',
}];
