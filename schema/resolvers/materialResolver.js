const Material = require('../models/Material');

module.exports = {
    Mutation: {
        createMaterial: async (__, args) => {
            try {
                const material = await new Material(args.input).save();
                if (material)
                    return {
                        message: "Material Created!",
                        status: true
                    }
            } catch (error) {
                return {
                    message: error.message,
                    status: false
                }
            }
        }
    }
}