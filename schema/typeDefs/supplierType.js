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
    input updateSupplierInput {
        _id: String
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
    type getSupplierMessage {
        status: Boolean
        message: String
        data: Supplier
    }
    type getSupplierPaginatorMessage{
        suppliers:[Supplier]
        paginator: Paginator
        message: String
    }
    type Query {
        getSupplierbyId(supplier_id: String!): getSupplierMessage!
        getSupplierWithPaginatioin(page: Int!,limit: Int!,keyword: String!): getSupplierPaginatorMessage!
    }
    type Mutation {
        createSupplier(input: createSupplierInput!): supplierMessage!
        updateSupplier(input: updateSupplierInput!): supplierMessage!
        deleteSupplier(supplier_id: String! ): supplierMessage!
    }
`