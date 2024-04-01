const mongoose = require('mongoose');

const AlertTypeSchema = new mongoose.Schema({
  alert_name: {
    type: String,
    required: true,
  },
  alert_description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['0', '1'],
    default: '1',
  },
  polygons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Polygon',
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const AlertType = mongoose.model('AlertType', AlertTypeSchema);

module.exports = AlertType;
