import Joi = require('joi');

let routes = [
    {
        method: 'GET',
        path: '/articles',
        config: {
            handler: '%plugins.amma-article.articleController.getAll%',
            plugins: {
                hal: {
                    embedded: {
                        result: {
                            path: 'results',
                            href: './{item._id}'
                        }
                    }
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/articles',
        config: {
            handler: '%plugins.amma-article.articleController.create%',
            validate: {
                payload: {
                    _id: Joi.string().required().min(2),
                    title: Joi.string().required().min(2),
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/articles/{id}',
        config: {
            handler: '%plugins.amma-article.articleController.get%',
        }
    },
    {
        method: 'PUT',
        path: '/articles/{id}',
        config: {
            handler: '%plugins.amma-article.articleController.update%',
            validate: {
                payload: {
                    _id: Joi.string(),
                    title: Joi.string().required().min(2),
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/articles/{id}',
        config: {
            handler: '%plugins.amma-article.articleController.remove%'
        }
    }
];
export default routes;
