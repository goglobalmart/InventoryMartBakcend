const Location = require('../models/Location');
const Requestion = require('../models/Requestion')
module.exports = {
    Query: {
        getLocationbyId: async (__, args) => {
            try {
                const findUser = await Location.findById(args.location_Id).exec();
                if (findUser)
                    return {
                        message: "Get Location success!",
                        status: true,
                        data: findUser
                    }
                if (!findUser)
                    return {
                        message: "Can not find user!",
                        status: false,
                        data: null
                    }
            } catch (error) {
                return {
                    message: error.message,
                    status: false,
                    data: null
                }
            }
        },
        getLocations: async (__, args, { req }) => {
            // console.log(req)
            try {
                const users = await Location.find(
                    {
                        "name": { $regex: args.keyword, $options: 'i' },
                        "type": { $regex: args.type, $options: 'i' }
                    });
                return {
                    message: "Get Location Success!",
                    status: true,
                    data: users
                }
            } catch (error) {
                return {
                    message: error.message,
                    status: false,
                    data: null
                }
            }
        }
    },
    Mutation: {
        createLocation: async (__, args) => {

            try {

                const location = await new Location(args.input).save();
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
        },
        updateLocation: async (__, args) => {
            // console.log(args)
            try {
                const findDouplicate = await Location.find({ name: args.input.name, _id: { $ne: args.input.location_Id } }).exec();
                if (findDouplicate.length != 0)
                    return {
                        message: "The Name is Already Used!",
                        status: false
                    }
                const FindLocation = await Location.findById(args.input.location_Id).exec();
                if (FindLocation.name === args.input.name) {
                    await Location.findByIdAndUpdate(args.input.location_Id, { remark: args.input.remark }).exec();
                } else {
                    await Location.findByIdAndUpdate(args.input.location_Id, args.input).exec();
                }
                return {
                    message: "កែប្រែជោគជ័យ!",
                    status: true
                }

            } catch (error) {
                return {
                    message: error.message,
                    status: false
                }
            }
        },
        deleteLocation: async (__, args) => {
            try {
                const findUsingLocation = await Requestion.find({ for_Location: args.location_Id }).exec();
                const location = await Location.findById(args.location_Id).exec();
                if (findUsingLocation.length > 0)
                    return {
                        message: `មានសម្ភារៈក្នុង ${location.name}  មិនអាចលុបបានទេ!`,
                        status: false
                    }

                const findDelete = await Location.findByIdAndDelete(args.location_Id).exec();
                if (findDelete) {
                    return {
                        message: "Location Deleted!",
                        status: true
                    }
                } else {
                    return {
                        message: "Location Has Been Delete!",
                        status: false
                    }
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