const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const BitSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
    set: setName,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  likes: {
    type: Number,
    min: 0,
    default: 0,
    required: true,
  },
  rebits: {
    type: Number,
    min: 0,
    default: 0,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  whoLiked: {
    type: [mongoose.Schema.ObjectId],
    required: false,
  },
});

BitSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  message: doc.message,
  likes: doc.likes,
  rebits: doc.rebits,
  createdDate: doc.createdDate,
  owner: doc.owner,
});

const BitModel = mongoose.model('Bit', BitSchema);
module.exports = BitModel;
