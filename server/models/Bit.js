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
    required: true,
  },
  rebits: {
    type: Number,
    min: 0,
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
});

BitSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  likes: doc.likes,
  rebits: doc.rebits,
});

const BitModel = mongoose.model('Bit', BitSchema);
module.exports = BitModel;
