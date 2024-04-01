const Permission = require("../models/PermissionsModel");
const Role = require("../models/RolesModel");



const getAllPermissions = async () => {

    const data = await Permission.find();
    return data;
}

const assignPermission = async (_, { permission, id }) => {

    if (permission) {

        const data = await Role.findByIdAndUpdate(id, {
            permissions: permission
        }, { new: true });
        console.log(data)

        return { message: 'updated successfully' };

    } else {
        throw Error('Permission is required')
    }

}

module.exports = { getAllPermissions, assignPermission }