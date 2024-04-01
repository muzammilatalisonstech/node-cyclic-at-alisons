const { default: axios } = require("axios");

const { addUser, login, getAllUsers, getUserByID, updateUser, updateUserCenter, updateUserStatus } = require("../controllers/user");
const { addRole, updateRole, updateRoleStatus, getAllRoles } = require("../controllers/role");
const { authenticateResolver } = require("../middleware/verifyToken");
const { addCenterViewPoint, getCenterViewPoints, updateCenterViewPoint, updateCenterStatus, getActiveCenterViewPoints } = require("../controllers/centerViewPoint");
const { addPolygon, updatePolygon, getAllPolygons, getActivePolygons, updatePolygonStatus, deletePolygon } = require("../controllers/polygons");
const { getAllAlertType, getAlertTypeById, addAlertType, updateAlertType, updateAlertTypeStatus } = require("../controllers/alertType");
const { getAllPermissions, assignPermission } = require("../controllers/permission");



const typeDefs = `
type CenterViewPoints {
    _id:ID!
    center_name:String!
    latitude:String!
    longitude:String!
    zoom_level:String!
    status:String!
    createdBy:User
}
type User {
    _id:ID!
    name: String!
    email: String!
    center:CenterViewPoints
    role:Role
    status:String!
}

type Polygon {
    _id: ID!
    poly_name: String!
    coordinates: [[Float]]
    color: String!
    status: String!
    type: String!
    radius:String
    center_lat:String
    center_lng:String 
    createdBy: User!
    alert_type:[AlertType]
  }

type AuthPayload {
    token: String!
    user: User!
}

type AlertType {
    _id:ID!
    alert_description:String!
    alert_name:String!
    polygons:[Polygon]
    status: String!
    createdBy: User!
}

type Permission {
    _id:ID!
    permission_name:String!
}

type Role {
    role_name:String!
    role_type:String!
    _id:ID!
    status:String
    permissions:[Permission]
}

type Res {
    message:String
}

type Query {
    getAllUsers:[User]
    getUserByID(id:ID!):User
    getAllRoles:[Role],
    getCenterViewPoints:[CenterViewPoints]
    getActiveCenterViewPoints:[CenterViewPoints]
    getAllPolygons:[Polygon]
    getActivePolygons:[Polygon]
    
    getAllAlertType:[AlertType]
    getAlertTypeById:AlertType

    getAllPermission:[Permission]

}
type Mutation {
    login(email: String!, password: String!): AuthPayload
    addUser(name: String!, email: String!,password: String!,role:String!): User
    updateUser(name: String, email: String ,role:String,id:String!): User
    updateUserStatus(id:String!,status:String!):User

    addRole(role_name:String!,role_type:String!):Role
    updateRole(roleId:String!,role_name:String,role_type:String):Role
    updateRoleStatus(roleId:String!,status:String!):Role

    addCenterViewPoint(center_name:String!,latitude:String!,longitude:String!,zoom_level:String!):CenterViewPoints
    updateCenterViewPoint(center_name:String,latitude:String!,longitude:String!,zoom_level:String,id:ID!):CenterViewPoints
    updateCenterStatus(status:String!,id:ID!):CenterViewPoints
    updateUserCenter(id:ID!):User

    addPolygon(poly_name:String!, coordinates:[[Float]], color: String!, alert_type:[String], type:String!, radius:String, center_lat:String, center_lng:String):Polygon
    updatePolygon(id:ID!, poly_name:String, coordinates: [[Float]]!, color: String):Polygon
    updatePolygonStatus(id:ID!, status:String, ):Polygon
    deletePolygon(id:ID! ):Res

    addAlertType(alert_description:String!, alert_name:String!):AlertType
    updateAlertType(id:String! , alert_description:String, alert_name:String ):AlertType
    updateAlertTypeStatus(id:ID!, status:String, ):AlertType

    assignPermission(id:ID!, permission:[String]!):Res
}
`

const resolvers = {

    Query: {

        getAllUsers: authenticateResolver(getAllUsers),
        getUserByID: authenticateResolver(getUserByID),
        getAllRoles: authenticateResolver(getAllRoles),
        getCenterViewPoints: authenticateResolver(getCenterViewPoints),
        getActiveCenterViewPoints: authenticateResolver(getActiveCenterViewPoints),

        getAllPolygons: authenticateResolver(getAllPolygons),
        getActivePolygons: authenticateResolver(getActivePolygons),

        getAllAlertType: authenticateResolver(getAllAlertType),
        getAlertTypeById: authenticateResolver(getAlertTypeById),

        getAllPermission: authenticateResolver(getAllPermissions)
    },

    Mutation: {
        addUser: authenticateResolver(addUser),
        login: login,
        updateUser: authenticateResolver(updateUser),
        updateUserStatus: authenticateResolver(updateUserStatus),

        addRole: authenticateResolver(addRole),
        updateRole: authenticateResolver(updateRole),
        updateRoleStatus: authenticateResolver(updateRoleStatus),

        addCenterViewPoint: authenticateResolver(addCenterViewPoint),
        updateCenterViewPoint: authenticateResolver(updateCenterViewPoint),
        updateCenterStatus: authenticateResolver(updateCenterStatus),
        updateUserCenter: authenticateResolver(updateUserCenter),


        addPolygon: authenticateResolver(addPolygon),
        updatePolygon: authenticateResolver(updatePolygon),
        updatePolygonStatus: authenticateResolver(updatePolygonStatus),
        deletePolygon: authenticateResolver(deletePolygon),

        addAlertType: authenticateResolver(addAlertType),
        updateAlertType: authenticateResolver(updateAlertType),
        updateAlertTypeStatus: authenticateResolver(updateAlertTypeStatus),

        assignPermission: authenticateResolver(assignPermission)
    },
}

module.exports = { typeDefs, resolvers }