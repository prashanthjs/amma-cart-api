var Mongoose = require("mongoose");
var options = {
    collection: 'article',
    schema: {
        _id: {
            type: String,
            require: true
        },
        title: {
            type: String,
            require: true
        },
        __v: {
            type: Number,
            select: false
        }
    }
};
var schema = new Mongoose.Schema(options.schema);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    collectionName: options.collection,
    schema: schema
};
