const User = require("../models/UserModel");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { verfiyToken } = require("../middleware/verifyToken")

// <----------- ADD USER ------------------>
//  ====== Mutation =========== //

const addUser = async (_, { name, email, password, role }) => {
  const user = await User.findOne({ email });

  if (user) {
    throw Error('User Already Exist')
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt)

  console.log(hashedPassword)
  const createUser = await User.create({
    name,
    email,
    role,
    password: hashedPassword,
  })
  console.log(createUser)

  return createUser
}

// <----------- ADD USER ------------------>

// <----------- LOGIN USER ------------------>
//  ====== Mutation =========== //

const login = async (_, { email, password }) => {
  try {
    const user = await User.findOne({ email }).populate(['role',

      {
        path: "center",
        select: "_id center_name zoom_level latitude longitude status",
      }]);
    if (!user) throw Error('Incorrect Email or Password');

    const is_password = bcrypt.compareSync(password, user.password);

    if (!is_password) throw Error('Incorrect Email or Password');
    if (user.status === '0') throw Error('This user is currently deactivated by Admin');


    console.log(user)
    const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, process.env.SECRET_KEY, { expiresIn: '12h' });
    return {
      token,
      user,
    };
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};
// <----------- LOGIN USER ------------------>





// <----------- GET ALL USER ------------------>
//  ====== QUERY =========== //
const getAllUsers = async (parent, args, context) => {



  const data = await User.find().populate({
    path: "role",
    select: "_id role_name"
  }).populate({
    path: "center",
    select: "_id center_name zoom_level latitude longitude status",
  });
  return data;


};

// <----------- GET ALL USER ------------------>



// <----------- GET USER BY ID ------------------>
//  ====== QUERY =========== //

const getUserByID = async (parent, { id }, context) => {
  const data = User.findById(id).populate({
    path: 'role',
    select: '_id role_name'

  }).populate({
    path: "center",
    select: "_id center_name zoom_level latitude longitude status",
  });
  return data;
};

// <----------- GET USER BY ID ------------------>





// <------------ UPDATE USER -------------------->
//  ====== Mutation =========== //

const updateUser = async (_, { name, email, role, id }, context) => {


  const existingUser = await User.findById(id);
  if (!existingUser) {
    throw new Error("User doesn't exist");
  }
  try {


    const userUpdate = {};
    if (name) userUpdate.name = name;
    if (email) userUpdate.email = email;
    if (role) userUpdate.role = role;


    const updatedUser = await User.findOneAndUpdate({ _id: id }, userUpdate, {
      new: true,
      runValidators: true,
    }).populate({
      path: "role",
      select: "_id role_name"
    }).populate({
      path: "center",
      select: "_id center_name zoom_level latitude longitude status",
    });

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    console.log(updatedUser);
    return updatedUser;
  } catch (error) {
    throw new Error(`Error while updating user: ${error.message}`);
  }
};



async function updateUserCenter(_, centerId, userData) {
  try {
    const user = await User.findByIdAndUpdate(userData._id, { $set: { center: centerId.id } }, { new: true }).populate({
      path: "role",
      select: "_id role_name"
    }).populate({
      path: "center",
      select: "_id center_name zoom_level latitude longitude status",
    });
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error('Error updating user center:', error);
    throw error;
  }
}


async function updateUserStatus(_, statusData, user) {
  try {
    if (statusData?.status === '1' || statusData?.status === '0') {
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: statusData.id,
        },
        { $set: { status: statusData.status } },
        { new: true }
      );
      return updatedUser;
    } else {
      throw new Error('Invalid Status Value');
    }
  } catch (error) {
    throw error;
  }
}
// <------------ UPDATE USER -------------------->




module.exports = { addUser, login, getAllUsers, getUserByID, updateUser, updateUserCenter, updateUserStatus }