// controllers/PolygonController.js
const AlertType = require('../models/AlertTypeModel');
const Polygon = require('../models/PolygonsModel');

// Function to add a new polygon
async function addPolygon(_, polygonData, user) {

  const newPolygonData = {
    ...polygonData,
    createdBy: user._id,
    status: '1', // Assuming default status is '1', modify as needed
  };
  try {
    if (newPolygonData?.type === 'circle') {
      if (!newPolygonData?.radius) throw Error('Circle must have radius!');
      if (!newPolygonData?.center_lat) throw Error('Circle must have center  latitude!');
      if (!newPolygonData?.center_lng) throw Error('Circle must have center  longitude!');
    }
    const newPolygon = await Polygon.create(newPolygonData);
    console.log(newPolygon, newPolygonData)
    if (polygonData?.alert_type?.length) {
      await Promise.all(polygonData.alert_type.map(async (id) => {
        const alertType = await AlertType.findById(id);

        if (alertType) {
          // If AlertType exists, update its polygons array
          if (alertType.polygons) {
            alertType.polygons.push(newPolygon._id);
          } else {
            alertType.polygons = [newPolygon._id];
          }
          await alertType.save();

          // Update the alert_type array in the newPolygon document
          // newPolygon.alert_type.push(alertType._id);
          // await newPolygon.save();
        } else {
          // If AlertType doesn't exist, create a new one
          throw new Error("AlertType not found");
        }
      }));
    }

    // Return newPolygon or perform additional tasks if needed
    return newPolygon;

  } catch (error) {
    throw error;
  }
}

// Update polygon
async function updatePolygon(_, updateData, user) {
  try {
    // Ensure that required fields are provided
    if (!updateData.coordinates || updateData.coordinates.length === 0) {
      throw new Error('Coordinates are required for updating a polygon.');
    }

    // Check if a polygon with the same coordinates already exists


    const updatedPolygon = await Polygon.findOneAndUpdate(
      {
        _id: updateData.id,
        createdBy: user._id,
      },
      {
        $set: {
          coordinates: updateData.coordinates,
          poly_name: updateData.poly_name,
          color: updateData.color,
          // Add other fields as needed
        },
      },
      { new: true }
    ).populate(
      [
        {
          path: "createdBy",
          select: "_id email name role center",
          populate: ['role', 'center']
        },
        'alert_type'
      ]
    );

    if (!updatedPolygon) {
      // The polygon with the specified ID and createdBy does not exist or does not belong to the user
      throw new Error('Polygon not found or you do not have permission to update it.');
    }

    return updatedPolygon;
  } catch (error) {
    throw error;
  }
}


async function deletePolygon(_, data) {
  const polygonId = data.id
  console.log(polygonId)
  try {
    // First, find the polygon by its ID
    const polygon = await Polygon.findById(polygonId);

    // If the polygon is not found, throw an error
    if (!polygon) {
      throw new Error('Polygon not found');
    }

    // Delete the polygon
    await polygon.deleteOne();

    // Also, remove references to this polygon from associated alert types
    const alertTypes = await AlertType.find({ polygons: polygonId });
    await Promise.all(alertTypes.map(async (alertType) => {
      // Remove the polygon ID from alert type's polygons array
      alertType.polygons = alertType.polygons.filter(id => id.toString() !== polygonId.toString());
      await alertType.save();
    }));

    // Return success message or any other necessary information
    return { message: 'Polygon deleted successfully' };
  } catch (error) {
    throw error;
  }
}

// Function to get all polygons
async function getAllPolygons(_, __, user) {
  try {
    const polygons = await Polygon.find({ createdBy: user._id }).populate(
      [{
        path: "createdBy",
        select: "_id email name role center",
        populate: [{
          path: "role",
          select: "role_name status"
        },

        {
          path: "center",
          select: "_id center_name zoom_level latitude longitude status",
        }]
      },
        'alert_type']
    );
    return polygons;
  } catch (error) {
    throw error;
  }
}

// Function to get only active polygons
async function getActivePolygons(_, __, user) {
  try {
    const activePolygons = await Polygon.find({ createdBy: user._id, status: '1' }).populate(
      [{
        path: "createdBy",
        select: "_id email name role center",
        populate: [{
          path: "role",
          select: "role_name status"
        },

        {
          path: "center",
          select: "_id center_name zoom_level latitude longitude status",
        }]
      },
      {
        path: "alert_type",
        select: "_id alert_name status alert_description"
      }]
    );
    return activePolygons;
  } catch (error) {
    throw error;
  }
}

// Function to update the status of a polygon
async function updatePolygonStatus(_, statusData, user) {
  try {
    if (statusData?.status === '1' || statusData?.status === '0') {
      const updatedPolygon = await Polygon.findOneAndUpdate(
        {
          _id: statusData.id,
          createdBy: user._id,
        },
        { $set: { status: statusData.status } },
        { new: true }
      ).populate(
        {
          path: "createdBy",
          select: "_id email name role center",
          populate: [{
            path: "role",
            select: "role_name status"
          },

          {
            path: "center",
            select: "_id center_name zoom_level latitude longitude status",
          }]
        }
      );
      return updatedPolygon;
    } else {
      throw new Error('Invalid Status Value');
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addPolygon,
  getAllPolygons,
  getActivePolygons,
  updatePolygonStatus,
  updatePolygon,
  deletePolygon,
};
