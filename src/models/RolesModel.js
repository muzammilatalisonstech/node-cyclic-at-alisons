const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  role_name: {
    type: String,
    required: true,
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission',
  }],
  status: {
    type: String,
    enum: ['0', '1'],
    default: '1',
  },
  role_type: {
    type: String,
    enum: ['super_admin', 'admin', 'user'],
    default: 'User',
  },

});

const Role = mongoose.model('Role', RoleSchema);

module.exports = Role;
