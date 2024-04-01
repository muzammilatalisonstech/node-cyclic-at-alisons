const Role = require("../models/RolesModel");
//----- status=1 (active) --- status=0 (inactive) -------------


// <------ -------- ---  Const Permission  ------- ------- --------->

// <------ -------- ---  Const Permission  ------- ------- --------->
const addRole = async (_, { role_name }) => {
  const role = await Role.findOne({ role_name });
  if (role) {
    throw Error('role Already Exist')
  }

  const AddRole = await Role.create({
    role_name,
  })
  console.log(AddRole)

  return AddRole
}


const updateRole = async (_, { roleId, role_name, role_type }) => {
  const role = await Role.findByIdAndUpdate(roleId, { role_name, role_type }, { new: true });

  if (!role) {
    throw new Error('Role not found');
  }

  return role;
};


const updateRoleStatus = async (_, statusData) => {

  try {
    if (statusData?.status === '1' || statusData?.status === '0') {
      const updatedRole = await Role.findOneAndUpdate(
        {
          _id: statusData.roleId,
        },
        { $set: { status: statusData.status } },
        { new: true }
      );
      return updatedRole;
    } else {
      throw new Error('Invalid Status Value');
    }
  } catch (error) {
    throw error;
  }

};


const getAllRoles = async () => {
  const roles = await Role.find().populate('permissions');

  console.log(roles)
  return roles;
};


module.exports = { addRole, updateRole, updateRoleStatus, getAllRoles };  