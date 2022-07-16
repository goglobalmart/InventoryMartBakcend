const { gql } = require('apollo-server-express');

module.exports = gql`
    scalar DataTime
    type Location {
        _id: ID
        name: String
        created_At: DataTime
        remark: String
        type: String
        
        # materials: [MaterialDetail]
    }
    # Input Type 
    input createLocationInput {
        name: String
        remark: String
        type: String
    }
    input updateLocationInput {
        location_Id: String
        name: String
        remark: String
        type: String
    }
    # Responding Message 
    type locationMessage {
        status: Boolean
        message: String
    }
    type getLocationMessage {
        status: Boolean
        message: String
        data: Location
    }
    type getLocationsMessage {
        status: Boolean
        message: String
        data: [Location]
    }
    type Query {
        getLocationbyId(location_Id: String!): getLocationMessage! 
        getLocations(keyword: String!, type: String!): getLocationsMessage!
        getTotalLocation(type: String): String!
    }
    type Mutation {
        createLocation(input: createLocationInput!): locationMessage!
        updateLocation(input: updateLocationInput!): locationMessage!
        deleteLocation(location_Id: String!): locationMessage!
    }
`