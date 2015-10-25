import Joi = require('joi');
import _ = require('lodash');
let createPayload = {
  _id: Joi.string().alphanum().required().min(2),
  title: Joi.string().required(),
  privileges: Joi.array().items(Joi.string()).required()
};
let updatePayload =  {
  title: Joi.string(),
  privileges: Joi.array().items(Joi.string())
};

module.exports = {
  createPayload: createPayload,
  updatePayload: updatePayload
};
