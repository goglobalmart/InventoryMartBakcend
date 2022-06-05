const Supplier = require('../models/Supplier')

module.exports = {
    Mutation: {
        createSupplier: async (__, args) => {
            try {
                const supplier = await new Supplier(args.input).save();
                if (supplier)
                    return {
                        message: "Supplier Created!",
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