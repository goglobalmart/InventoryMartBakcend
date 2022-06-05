const { gql } = require('apollo-server-express');

module.exports = gql`
    scalar DataTime
    type Location {
        _id: ID
        name: String
        create_At: DataTime
        remark: String
        materials: [MaterialDetail]
    }
    # Input Type 
    input createLocationInput {
        name: String
        remark: String
    }
    # Responding Message 
    type locationMessage {
        status: Boolean
        message: String
    }
    type MaterialDetail {
        material: Material
        date: DataTime
        expired_Date:  DataTime
        qty: Float
        supplier: Supplier
    }
    type Mutation {
        createLocation(input: createLocationInput!): locationMessage!
        # updateLocation
        # deleteLocation if materails.legngth == 0 can delete
        # createPurches
    }
`