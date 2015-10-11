declare let manifest: {
    server: {
        debug: {
            request: string[];
        };
        connections: {
            routes: {
                cors: {};
            };
        };
    };
    connections: {
        port: {};
        host: {};
    }[];
    plugins: {
        'good': {
            reporters: {
                reporter: any;
                events: {
                    request: string;
                    error: string;
                    log: string;
                };
            }[];
        };
        'halacious': any;
        'amma-event-emitter': any;
        'amma-db': {
            options: {
                db: {};
            };
        };
        'amma-db-parser': any;
        'amma-file-upload': any;
        'amma-article': any;
    };
};
export = manifest;
