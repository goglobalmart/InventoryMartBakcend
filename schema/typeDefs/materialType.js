const { gql } = require('apollo-server-express');

module.exports = gql`
    scalar DataTime
    type Material {
        _id: ID
        name: String
        price: Float
        category: String
        image_src: String
        remark: String
        type: String
        feature: String
        unit: String
        created_At: DataTime
    }
    type MaterialDetail {
        status: String
        material_Name: String
        material: Material
        expired_Date:  DataTime
        qty: Float
        unit_Price: Float
        supplier: Supplier
        supplier_Name: String
        in_Location: Location 
        location_Name: String
        request: Requestion
        key: DataTime
    }
    # Input Data
    input createMaterialInput {
        name: String
        price: Float
        category: String
        image_src: String
        remark: String
        type: String
        feature: String
        unit: String
    }
    input updateMaterialInput {
        material_Id: String
        name: String
        price: Float
        category: String
        image_src: String
        remark: String
        type: String
        feature: String
        unit: String
        unit_Price: Float
        expired_Date:  DataTime
    }
    input inputMaterialDetail {
        material_Name: String
        material: String
        expired_Date:  DataTime
        qty: Float
        supplier: String
        supplier_Name: String
        in_Location: String 
        location_Name: String
        key: DataTime
        unit_Price: Float
    }
    # Responding Message 
    type materialMessage {
        status: Boolean
        message: String
    }
    type getMaterialMessage {
        status: Boolean
        message: String
        data: Material
    } 
    type getMaterialPaginatorMessage {
        materials: [Material]
        paginator: Paginator
        message: String
    }
    type getMaterialUsagePaginatorMessage {
        materials: [MaterialDetail]
        paginator: Paginator
        message: String
    }
    type getMaterialsUsageMessage {
        data: [MaterialDetail]
        status: String
        message: String
    }
    type getMaterialQty {
        _id: ID
        name: String
        price: Float
        category: String
        image_src: String
        remark: String
        type: String
        qty: Float
    }
    type getMaterialsMessage {
        status: Boolean
        message: String
        data: [Material]
    }
    # Query
    type Query {
        # getMaterialByid(material_Id: String!): getMaterialMessage!
        getMaterials: getMaterialsMessage!
        getMaterialwithPagination(page: Int!,limit: Int!,keyword: String!, type: String!, category: String!): getMaterialPaginatorMessage!
        getMaterialUsagewithPagination(page: Int!,limit: Int!,keyword: String!,location: String type: String!, category: String!): getMaterialUsagePaginatorMessage!
        getMaterialUsagebyRequestion(requestion_Id: String!): getMaterialsUsageMessage!
        getLessMaterialUsagebyLocation(location_Id: String!): getMaterialsUsageMessage!
    }
    #Mutation
    type Mutation {
        createMaterial(input: createMaterialInput): materialMessage!
        updateMaterial(input: updateMaterialInput!): materialMessage!
        deleteMaterial(material_Id: String!): materialMessage!
        moveMaterialLocation(material_Id: String!,in_Location_Id: String!, moving_Location_Id: String!, qty: Float!):materialMessage!
    }
`