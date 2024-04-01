
const jwt =require("jsonwebtoken");
const User = require("../models/UserModel");

const verifyActiveUser = async(data)=>{
  const userData=await User.findById(data.userId)

  if(userData){
    if(userData.status==="1"){
      return userData;
    }else{
      throw new Error('Your account is not active');
    }
  }else{
    throw new Error("User not found ")
  }
}

const verfiyToken = async(token) => {
    if(token){
        const isAuthorized=jwt.verify(token,process.env.SECRET_KEY)
        const result= await verifyActiveUser(isAuthorized)
        return result;
    }else{
        return null;
    }
  };

  const authenticateResolver = (resolverFunction) => {
    return async (parent, args, context) => {
        const isVerified=await verfiyToken(context.token);
      if (isVerified) {
        return resolverFunction(parent, args, isVerified);
      } else {
        throw new Error('User is not authenticated');
      }
    };
  };




module.exports={verfiyToken,authenticateResolver}


