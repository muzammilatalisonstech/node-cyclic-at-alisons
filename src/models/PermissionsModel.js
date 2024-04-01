const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
    permission_name: {
        type: String,
        required: true
    }
});

const Permission = mongoose.model('Permission', PermissionSchema);

module.exports = Permission;
