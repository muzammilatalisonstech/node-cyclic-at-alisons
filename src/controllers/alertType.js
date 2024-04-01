const AlertType = require("../models/AlertTypeModel");


async function addAlertType(_,alertData,user) {
    console.log(user)
      const alertViewData={
          ...alertData,
          createdBy:user._id,
      }
    try {
      const newCenter = await AlertType.create(alertViewData);
      return newCenter;
    } catch (error) {
      throw error;
    }
  }

  async function getAllAlertType(_,__,user) {
    try {
      const alertTypes = await AlertType.find({ createdBy: user._id }).populate(
          [{
          path:"createdBy",
          select:"_id email name role",
          populate:['role']
          },
         'polygons'
          ]
      );
      // console.log(alertTypes[0].createdBy)
      
      return alertTypes;
    } catch (error) {
      throw error;
    }
  }
  
  async function getAlertTypeById(_,{id},user) {
    try {
      const alertTypes = await AlertType.find({_id:id, createdBy: user._id }).populate(
          {
          path:"createdBy",
          select:"_id email name role",
          populate:{
              path:"role",
              select:"role_name status"
          }
          }
      );
      // console.log(alertTypes[0].createdBy)
      
      return alertTypes;
    } catch (error) {
      throw error;
    }
  }
  

  async function updateAlertType(_, updateData, user) {


    try {
      const updatedAlertType = await AlertType.findOneAndUpdate(
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
  
      if (!updatedAlertType) {
        // The center with the specified ID and createdBy does not exist or does not belong to the user
        throw new Error('Alert not found or you do not have permission to update it.');
      }
  
      return updatedAlertType;
    } catch (error) {
      throw error;
    }
  }


  async function updateAlertTypeStatus(_, statusData, user) {
    try {
      if (statusData?.status === '1' || statusData?.status === '0') {
        const updatedAlertStatus = await AlertType.findOneAndUpdate(
          {
            _id: statusData.id,
            createdBy: user._id,
          },
          { $set: { status: statusData.status } },
          { new: true }
        ).populate(
          {
          path:"createdBy",
          select:"_id email name role center",
          populate:[{
              path:"role",
              select:"role_name status"
          }]
          }
      );
        return updatedAlertStatus;
      } else {
        throw new Error('Invalid Status Value');
      }
    } catch (error) {
      throw error;
    }
  }


  module.exports = {
    addAlertType,
    getAlertTypeById,
    getAllAlertType,
    updateAlertType,
    updateAlertTypeStatus,
  };