module.exports = [
    {
        type: 'onPreStart',
        method: '%plugins.amma-user.roleService.onPreStart%'
    },
    {
        type: 'onPreStart',
        method: '%plugins.amma-user.userService.onPreStart%'
    },
    {
        type: 'onRequest',
        method: '%plugins.amma-user.authHandler.onRequest%'
    }
];
