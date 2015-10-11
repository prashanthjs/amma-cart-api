var Config = require('config');
var GoodConsole = require('good-console');
var manifest = {
    server: {
        debug: {
            request: ['error']
        },
        connections: {
            routes: {
                cors: Config.get('cors')
            }
        }
    },
    connections: [{
            port: Config.get('port'),
            host: null
        }],
    plugins: {
        'good': {
            reporters: [{
                    reporter: GoodConsole,
                    events: {
                        request: '*',
                        error: '*',
                        log: '*'
                    }
                }]
        },
        'halacious': null,
        'amma-event-emitter': null,
        'amma-db': {
            options: {
                db: Config.get('db')
            }
        },
        'amma-db-parser': null,
        'amma-file-upload': null,
        './lib/amma-article': null
    }
};
module.exports = manifest;
