// models/Todo.js

const mongoose = require('mongoose');

const UserShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },

  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['0', '1'],
    default: '1',
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  },
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CenterViewPoint'
  }
});

const User = mongoose.model('User', UserShema);

module.exports = User;
