const mongoose = require('mongoose');

const PolygonSchema = new mongoose.Schema({
  poly_name: {
    type: String,
    required: true,
  },
  coordinates: {
    type: [[Number]],
  },
  color: {
    type: String,
    required: true,
  },
  center_lat: {
    type: String,
  },
  center_lng: {
    type: String,
  },
  
  radius: {
    type: String,
  },
  radius_unit:{
    type: String,
    enum: ['kilometer', 'meter'],
    default: 'meter',
  },
  status: {
    type: String,
    enum: ['0', '1'],
    default: '1',
  },
  type:{
    type:String,
    enum:['free','circle'],
    required:true,
  },
  alert_type: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AlertType',
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Polygon = mongoose.model('Polygon', PolygonSchema);

module.exports = Polygon;
