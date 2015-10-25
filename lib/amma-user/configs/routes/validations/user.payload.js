var Joi = require('joi');
var createPayload = {
    _id: Joi.string().alphanum().required().min(2),
    name: Joi.object().required().keys({
        firstName: Joi.string().alphanum().required(),
        lastName: Joi.string().alphanum().required(),
    }),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().required(),
    dob: Joi.date().format('YYYY-MM-DD'),
    gender: Joi.any().tags(['male', 'female', 'other']),
    address: Joi.object().keys({
        addressLine1: Joi.string().required(),
        addressLine2: Joi.string().optional(),
        town: Joi.string().required(),
        county: Joi.string(),
        country: Joi.string().required(),
        postcode: Joi.string().required()
    })
};
var updatePayload = {
    name: Joi.object().keys({
        firstName: Joi.string().alphanum(),
        lastName: Joi.string().alphanum(),
    }),
    email: Joi.string().email().optional(),
    contactNumber: Joi.string().optional(),
    dob: Joi.date().format('YYYY-MM-DD'),
    gender: Joi.any().tags(['male', 'female', 'other']),
    address: Joi.object().keys({
        addressLine1: Joi.string().required(),
        addressLine2: Joi.string(),
        town: Joi.string(),
        county: Joi.string(),
        country: Joi.string().required(),
        postcode: Joi.string().required()
    })
};
module.exports = {
    createPayload: createPayload,
    updatePayload: updatePayload
};
