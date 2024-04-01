// models/CenterViewPoint.js

const mongoose = require('mongoose');

const CenterViewPointSchema = new mongoose.Schema({
  center_name: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  zoom_level: {
    type: String,
    required: true,
  },
  status:{
    type: String,
    enum: ['0', '1'],
    default: '1',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const CenterViewPoint = mongoose.model('CenterViewPoint', CenterViewPointSchema);

module.exports = CenterViewPoint;
