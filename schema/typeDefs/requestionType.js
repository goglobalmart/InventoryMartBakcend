const { gql } = require('apollo-server-express');

module.exports = gql`
    scalar DataTime
    type Requestion {
        _id: ID
        type: String
        no: String
        need_Date: DataTime
        reqeustion_By: User
        update_By: User
        for_Location: Location
        priority: String
        status: String
        materials: [MaterialDetail]
        remark: String
    }
    # Responding Message 
    type requestionMessage {
        status: Boolean
        message: String
    }
    # Input Data
    input createRequestionInput {
        type: String
        need_Date: DataTime
        for_Location: String
        priority: String
        reqeustion_By: String
        materials: [inputMaterialDetail]
        remark: String
    }
    input updateRequestionInput {
        _id: String
        type: String
        need_Date: DataTime
        for_Location: String
        priority: String
        reqeustion_By: String
        materials: [inputMaterialDetail]
        remark: String
    }
    # Get responding message 
    type getRequestionMessage {
        message: String
        data: Requestion
        status: Boolean
    }
    type requestionMessage {
        message: String
        status: Boolean
    }
    type getRequestionsPagination {
        requestions:[Requestion]
        paginator: Paginator
        message: String
    }
    # Query
    type Query {
        # getRequestionbyId(requestion_Id: String): getRequestionMessage! 
        getRequestionsWithPagination(page: Int!,limit: Int!,keyword: String!, type: String!,priority: String!, status: String!): getRequestionsPagination!
    }
  
    type Mutation {
        createRequestion(input: createRequestionInput): requestionMessage!
        deleteRequestion(requestion_Id: String!): requestionMessage! 
        updateRequestion(input: updateRequestionInput!): requestionMessage! 
        updateRequestionStatus(status: String!, requestion_Id: String!): requestionMessage!
        receiveMaterial(requestion_Id: String!): requestionMessage!
    }
`