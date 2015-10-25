import Mongoose = require("mongoose");
import MongooseValidator = require('mongoose-validator');
let schemaJson = {
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

export default {
  collectionName: 'roles',
  schema: new Mongoose.Schema(schemaJson)
};
