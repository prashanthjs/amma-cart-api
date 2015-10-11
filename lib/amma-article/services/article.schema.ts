import Mongoose = require("mongoose");

let options = {
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

let schema = new Mongoose.Schema(options.schema);
export default {
  collectionName: options.collection,
  schema: schema
};
