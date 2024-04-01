const Permission = require("../models/PermissionsModel");
const Role = require("../models/RolesModel");



const getAllPermissions = async () => {

    const data = await Permission.find();
    return data;
}

const assignPermission = async (_, { permission, id }) => {
    if (!permission) {
        throw new Error('Permission is required');
    }

    const data = await Role.findById(id);
    if (!data) {
        throw new Error('Role not found');
    }

    if (data.role_type === 'super_admin') {
        throw new Error('Cannot update permissions for super_admin role');
    }

    data.permissions = permission;
    await data.save();

    console.log(data);
    return { message: 'Updated successfully' };
}
module.exports = { getAllPermissions, assignPermission }