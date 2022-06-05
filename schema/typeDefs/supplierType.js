const { gql } = require('apollo-server-express');

module.exports = gql`
    scalar DataTime
    type Supplier {
        _id: ID
        name: String
        phone_Number: String
        email: String
        location: String
        create_At: DataTime
    }
     # Input Type 
    input createSupplierInput {
        name: String
        phone_Number: String
        email: String
        location: String
    }
    # Responding Message 
    type supplierMessage {
        status: Boolean
        message: String
    }
    type Mutation {
        createSupplier(input: createSupplierInput): supplierMessage!
    }
`