var Mongoose = require("mongoose");
var MongooseValidator = require('mongoose-validator');
var nameSchema = {
    firstName: {
        type: String,
        require: true,
        validate: MongooseValidator({
            validator: 'isAlphanumeric'
        })
    },
    lastName: {
        type: String,
        require: true,
        validate: MongooseValidator({
            validator: 'isAlphanumeric'
        })
    }
};
var addressSchema = {
    addressLine1: {
        type: String,
        require: true
    },
    addressLine2: {
        type: String,
        require: false
    },
    town: {
        type: String,
        require: true
    },
    county: {
        type: String,
        require: false
    },
    country: {
        type: String,
        require: false
    },
    postcode: {
        type: String,
        require: true
    }
};
var schemaJson = {
    _id: {
        type: String,
        unique: true,
        require: true
    },
    name: nameSchema,
    password: {
        type: String,
        require: true,
        select: false
    },
    email: {
        type: String,
        require: true,
        unique: true,
        validate: MongooseValidator({
            validator: 'isEmail'
        })
    },
    contactNumber: {
        type: String,
        require: true
    },
    dob: {
        type: Date,
        require: false
    },
    gender: {
        type: String,
        require: false,
        validate: MongooseValidator({
            validator: 'matches',
            arguments: ['^(male|female|other)$'],
            message: 'Gender should be either male, female or other'
        })
    },
    address: addressSchema,
    extra: Mongoose.Schema.Types.Mixed,
    cache: Mongoose.Schema.Types.Mixed,
    isActive: {
        type: Boolean,
        default: true
    },
    private: {
        type: Mongoose.Schema.Types.Mixed,
        require: false,
        select: false
    },
    token: {
        type: [String],
        require: false,
        select: false
    },
    __v: {
        type: Number,
        select: false
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    collectionName: 'user',
    schema: new Mongoose.Schema(schemaJson)
};
