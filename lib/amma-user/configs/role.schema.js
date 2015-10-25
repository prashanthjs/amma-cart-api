var Mongoose = require("mongoose");
var schemaJson = {
    _id: {
        type: String,
        unique: true,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    privileges: [String],
    extra: Mongoose.Schema.Types.Mixed,
    cache: Mongoose.Schema.Types.Mixed,
    private: {
        type: Mongoose.Schema.Types.Mixed,
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
    collectionName: 'roles',
    schema: new Mongoose.Schema(schemaJson)
};
