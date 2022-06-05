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
    }
    # Input Data
    input createMaterialInput {
        name: String
        price: Float
        category: String
        image_src: String
        remark: String
    }
    # Responding Message 
    type materialMessage {
        status: Boolean
        message: String
    } 
    type Mutation {
        createMaterial(input: createMaterialInput!): materialMessage!
        # updateMaterial 
        # deleteMaterial if 
        # 
    }
`