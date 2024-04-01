// controllers/CenterViewPointController.js
const CenterViewPoint = require('../models/CenterViewPointModel');

// Function to add a new center view point
async function addCenterViewPoint(_,centerData,user) {
  console.log(user)
    const centerViewData={
        ...centerData,
        createdBy:user._id,
        status:"1"
    }

    const existingCenter = await CenterViewPoint.findOne({
        latitude: centerViewData.latitude,
        longitude: centerViewData.longitude,
        createdBy:user._id,
      });
    
      if (existingCenter) {
        // A center with the same latitude and longitude already exists
        throw new Error('A center with the same latitude and longitude already exists.');
      }
    // console.log(user)
  try {
    const newCenter = await CenterViewPoint.create(centerViewData);
    return newCenter;
  } catch (error) {
    throw error;
  }
}

// Function to get center view points
async function getCenterViewPoints(_,__,user) {
  try {
    const centerPoints = await CenterViewPoint.find({ createdBy: user._id }).populate(
        {
        path:"createdBy",
        select:"_id email name role",
        populate:{
            path:"role",
            select:"role_name status"
        }
        }
    );
    // console.log(centerPoints[0].createdBy)
    
    return centerPoints;
  } catch (error) {
    throw error;
  }
}
async function getActiveCenterViewPoints(_,__,user) {
  try {
    const centerPoints = await CenterViewPoint.find({ createdBy: user._id ,status:"1"}).populate(
        {
        path:"createdBy",
        select:"_id email name role",
        populate:{
            path:"role",
            select:"role_name status"
        }
        }
    );
    // console.log(centerPoints[0].createdBy)
    
    return centerPoints;
  } catch (error) {
    throw error;
  }
}

// Function to update center view point by ID
async function updateCenterViewPoint(_, updateData, user) {


    if (!updateData.latitude || !updateData.longitude) {
        throw new Error('Latitude and longitude are required fields.');
      }


    // const existingCenter = await CenterViewPoint.findOne({
    //     latitude: updateData.latitude,
    //     longitude: updateData.longitude,
    //     createdBy:user._id,
    //   });
    
    //   if (existingCenter) {
    //     // A center with the same latitude and longitude already exists
    //     throw new Error('A center with the same latitude and longitude already exists.');
    //   }


    try {
      const updatedCenter = await CenterViewPoint.findOneAndUpdate(
        {
          _id: updateData.id,
          createdBy: user._id,
        },
        updateData,
        { new: true }
      ).populate(
        {
        path:"createdBy",
        select:"_id email name role",
        populate:{
            path:"role",
            select:"role_name status"
        }
        }
    );;
  
      if (!updatedCenter) {
        // The center with the specified ID and createdBy does not exist or does not belong to the user
        throw new Error('Center not found or you do not have permission to update it.');
      }
  
      return updatedCenter;
    } catch (error) {
      throw error;
    }
  }

// Function to update status of center view point by ID
async function updateCenterStatus(_,statusData,user) {

    try {
if(statusData?.status=="1"||statusData?.status=="0"){

    const updatedCenter = await CenterViewPoint.findOneAndUpdate(
        {
          _id: statusData.id,
          createdBy: user._id,
        },
        { $set: { status: statusData.status } },
        { new: true }
      ).populate(
        {
        path:"createdBy",
        select:"_id email name role",
        populate:{
            path:"role",
            select:"role_name status"
        }
        }
    );
    return updatedCenter;

}else{
    throw new Error( "Invalid Status Value");
}
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addCenterViewPoint,
  getCenterViewPoints,
  updateCenterViewPoint,
  updateCenterStatus,
  getActiveCenterViewPoints
};
