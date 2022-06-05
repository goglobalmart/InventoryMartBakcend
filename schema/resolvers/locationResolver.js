const Location = require('../models/Location');

module.exports = {
    Mutation: {
        createLocation: async (__, args) => {
            console.log(args)
            try {
                // const material = await new Material(args.input).save();
                const location = await new Location(args.input).save();
                // console.log(location)
                if (location)
                    return {
                        message: "Created!",
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