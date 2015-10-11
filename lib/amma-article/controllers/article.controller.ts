import Hapi = require("hapi");
import Boom = require("boom");
import Async = require('async');
import ArticleModel = require('../services/article.model');


interface IRequestWithParamId extends Hapi.IRequestHandler<Hapi.Request> {
  params: {
    id: any
  }
  payload?: ArticleModel.IArticleDocument
}

export default class ArticleController {

  constructor(private _server: Hapi.Server) {

  }

  getService(): ArticleModel.IArticleModel {
    return this._server.plugins['amma-article'].articleModel;
  }
  getAll(request: Hapi.Request, reply: Hapi.IReply): void {
    let service = this.getService();
    let options = request.query;
    Async.parallel({
      results: (callback: (err?: any, results?: any) => any) => {
        service.findAll(request.query, callback);
      },
      total: (callback: (err?: any, results?: any) => any) => {
        service.findAllCount(request.query, callback);
      }
    }, (err?: any, results?: any): any => {
        if (err) {
          return reply(Boom.badImplementation(err));
        }
        else {
          let res = {
            results: results.results,
            meta: {
              total: results.total
            }
          };
          return reply(res);
        }
      });
  }

  get(request: IRequestWithParamId, reply: Hapi.IReply): void {
    let _id = request.params.id;
    let service = this.getService();
    Async.parallel({
      results: (callback: (err?: any, results?: any) => any) => {
        service.findById(_id, callback);
      }
    }, (err?: any, results?: any): any => {
        if (err) {
          reply(Boom.badImplementation(err));
        }
        else if (!results.results) {
          reply(Boom.notFound('not found'));
        } else {
          reply(results.results);
        }
      });
  }

  create(request: Hapi.Request, reply: Hapi.IReply): void {
    let service = this.getService();
    Async.series({
      save: (callback) => {
        service.create(request.payload, callback);
      },
      results: (callback) => {
        service.findById(request.payload._id, callback);
      }
    }, (err?: any, results?: any): any => {
        if (err) {
          if (11000 === err.code || 11001 === err.code) {
            return reply(Boom.forbidden('id exists already'));
          } else {
            return reply(Boom.forbidden(err));
          }
        }
        else {
          return reply(results.results).created('/articles/' + request.payload._id);
        }
      });
  }
  update(request: IRequestWithParamId, reply: Hapi.IReply): void {
    let service = this.getService();
    let _id = request.params.id;
    let payload = request.payload;
    payload._id = _id;
    Async.series({
      save: (callback) => {
        return service.findByIdAndUpdate(_id, payload, callback);
      },
      results: (callback) => {
        return service.findById(_id, callback);
      }
    }, (err?: any, results?: any): any => {
        if (err) {
          return reply(Boom.badImplementation(err));
        }
        else if (!results.results) {
          reply(Boom.notFound('not found'));
        }
        else {
          return reply(results.results);
        }
      });
  }

  remove(request: IRequestWithParamId, reply: Hapi.IReply) {
    let service = this.getService();
    let _id = request.params.id;
    Async.series({
      results: (callback) => {
        return service.findByIdAndRemove(_id, callback);
      }
    }, (err?: any, results?: any): any => {
        if (err) {
          return reply(Boom.badRequest(err));
        }
        else {
          return reply({}).code(204);
        }
      });
  }

}
