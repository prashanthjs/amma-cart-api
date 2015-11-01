import Glue = require('glue');
import Config = require('config');
import GoodConsole = require('good-console');


let manifest = {
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
        host: Config.get('host')
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
        //'halacious': null,
        'amma-event-emitter': null,
        'amma-db': {
            options: {
                db: Config.get('db')
            }
        },
        'amma-db-parser': null,
        'amma-file-upload': null,
        '../../../../amma-user': {
            options: {
                fileOptions: {
                    'srcDir': __dirname + '/../data/uploads/public/',
                    'tempDir': __dirname + '/../data/uploads/temp/',
                    'thumbnails': [
                        {
                            name: 'profile',
                            width: 200,
                            height: 200
                        }
                    ]
                }
            }
        }
    }
};
export = manifest;
