const { gql } = require("apollo-server-express");

module.exports = gql`
     scalar DataTime
     type ReleaseMaterial {
        _id: ID
        no: String
        delivery_Date: DataTime
        created_At: DataTime
        order_Date: DataTime
        customer_Id: Customer
        stock_Controller_Id: User
        delivery_man: User
        status: Boolean
        items: [Items]
    }
    type Customer {
        _id: ID
        name: String
        tel: String
        email: String
        address: String
        remark: String
        created_At: DataTime
    }
    type Items {
        materrail_Id: Material
        from_Stock_Id: Location
        qty: Float
        other: String
        key: DataTime
    }
    type customerMessage {
        status: Boolean
        message: String
    }
    type customersMessage {
        status: Boolean
        message: String
        data: [Customer]
    }
    type releaseMaterialMessage {
        status: Boolean
        message: String
    }
    type getRelaseCardPagination {
        data:[ReleaseMaterial]
        paginator: Paginator
        message: String
    }
    type getRelaseCardsMessage {
        data:[ReleaseMaterial]
        message: String
        status: Boolean
    }
    type getCustomerMessage {
        status: Boolean
        message: String
        data: Customer
    }
    # Input
    input createCustomerIntput {
        name: String
        tel: String
        email: String
        address: String
        remark: String
    }
    input updateCustomerIntput {
        _id: String
        name: String
        tel: String
        email: String
        address: String
        remark: String
    }
    input releaseMaterialInput {
        delivery_Date: DataTime
        order_Date: DataTime
        customer_Id: String
        delivery_man: String
        items: [itemsInput]
    }
    input itemsInput {
        materrail_Id: String
        from_Stock_Id: String
        qty: Float
        other: String
        key: DataTime
    }
    type Query {
        getCustomers: customersMessage!
        getCustomerbyId(customer_Id: String!): getCustomerMessage!
        getReleaseMaterialPagination(page: Int!,limit: Int!, customer_Id: String!, stock_Controller_Id: String!, order_Date: String!): getRelaseCardPagination!
        getRelaseCardByDate(delivery_Date: String!): getRelaseCardsMessage!
    }
    type Mutation {
        createCustomer(input: createCustomerIntput!): customerMessage!
        updateCustomer(input: updateCustomerIntput!): customerMessage!
        deleteCustomer(customer_Id: String!): customerMessage!
        createReleasMaterialCard(input: releaseMaterialInput!): releaseMaterialMessage!
        # deleteReleasMaterialCard()
        voidReleasMaterialCard(releas_Card_Id: String!): releaseMaterialMessage!
        # udpateReleasMaterialCard()
    }
`