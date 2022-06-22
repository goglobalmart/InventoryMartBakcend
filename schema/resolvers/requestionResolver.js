const Requestion = require('../models/Requestion');
const { Requestion_Number_Generator } = require('../../util/fn');
// const { authCheck } = require('../../helpers/auth');
// const User = require('../models/User');
// const Location = require('../models/Location');
const MaterialUsage = require('../models/MaterialUsage');

const requestionLabels = {
    docs: "requestions",
    limit: "perPage",
    nextPage: "next",
    prevPage: "prev",
    meta: "paginator",
    page: "currentPage",
    pagingCounter: "slNo",
    totalDocs: "totalDocs",
    totalPages: "totalPages",
};
module.exports = {
    Query: {
        // getRequestionbyId: async (__, args) => {
        //     try {
        //         const reqeustion = await Requestion.findById(args.requestion_Id)
        //             .populate("for_Location").populate("materials.material").populate("materials.supplier").populate("reqeustion_By").exec();
        //         if (reqeustion)
        //             return {
        //                 message: "Get Requestion Success!",
        //                 status: true,
        //                 data: reqeustion
        //             }
        //     } catch (error) {
        //         return {
        //             message: error.message,
        //             status: false,
        //             data: null
        //         }
        //     }
        // },
        getRequestionsWithPagination: async (__, args) => {
            const options = {
                page: args.page || 1,
                limit: args.limit || 10,
                customLabels: requestionLabels,
                sort: {
                    createdAt: -1,
                },
                populate: "reqeustion_By for_Location",
            }
            // console.log(args.status)
            const query = {
                $and: [
                    { no: { $regex: args.keyword, $options: "i" } },
                    { type: { $regex: args.type, $options: "i" } },
                    { status: { $regex: args.status, $options: "i" } },
                    { priority: { $regex: args.priority, $options: "i" } },
                ],
            }

            const requestions = await Requestion.paginate(query, options);

            return requestions;
        }
    },
    Mutation: {
        createRequestion: async (__, args) => {
            let newArray = [];
            try {

                const getlength = await Requestion.find().exec();
                const number = await Requestion_Number_Generator(getlength.length);
                const requestion = await new Requestion({
                    ...args.input,
                    no: number
                }).save();
                console.log(requestion)
                if (requestion)
                    args.input.materials.forEach(element => {
                        const finalResult = Object.assign(element, { request: requestion._id });
                        newArray.push(finalResult);
                    });
                await MaterialUsage.insertMany(newArray)
                return {
                    message: "Requestion Created!",
                    status: true
                }
            } catch (error) {
                return {
                    message: error.message,
                    status: false
                }
            }
        },
        deleteRequestion: async (__, args) => {
            try {
                const checkStatus = await Requestion.findById(args.requestion_Id).exec();
                if (!checkStatus)
                    return {
                        message: "Cannot find Requestion to delete!",
                        status: false
                    }
                if (checkStatus.status != "រងចាំ")
                    return {
                        message: `សំណើត្រូវបាន ${checkStatus.status}។ មានអាចលុប!`,
                        status: true
                    }
                const checkDelete = await Requestion.findByIdAndDelete(args.requestion_Id).exec();
                if (checkDelete) {
                    await MaterialUsage.deleteMany({
                        request: checkDelete._id
                    }).then(function () {
                        console.log("Data deleted"); // Success
                    }).catch(function (error) {
                        console.log(error); // Failure
                    });
                    return {
                        message: "សំណើជោគជ័យ!",
                        status: true
                    }
                }

            } catch (error) {
                return {
                    message: error.message,
                    status: false
                }

            }
        },
        updateRequestion: async (__, args) => {
            // console.log(args.input)
            try {
                const findRequestion = await Requestion.findById(args.input._id).exec();
                if (findRequestion.status != "រងចាំ")
                    return {
                        message: `សំណើរនេះត្រូវបាន ៖ ${findRequestion.status} មិនអាចកែប្រែបាន!`,
                        status: false
                    }

                await Requestion.findByIdAndUpdate(args.input._id, args.input).exec();
                return {
                    message: `សំណើរនេះត្រូវបានកែប្រែ!`,
                    status: true
                }
            } catch (error) {
                return {
                    message: error.message,
                    status: false
                }
            }
        },
        updateRequestionStatus: async (__, args, { req }) => {
            try {
                const getRequestion = await Requestion.findByIdAndUpdate(args.requestion_Id, { status: args.status });
                if (getRequestio)
                    return {
                        message: `សំណើរត្រូវបាន៖ ${args.status}`,
                        status: false
                    }
            } catch (error) {
                return {
                    message: error.message,
                    status: false
                }
            }
        },
        receiveMaterial: async (__, args) => {
            try {
                const reqeustion = await Requestion.findById(args.requestion_Id).exec();

                if (!reqeustion)
                    return {
                        message: 'រកសំណើរមិនឃើញ',
                        status: false
                    }

                const materials = await MaterialUsage.find({ request: reqeustion._id.toString() }).populate('material').populate('in_Location').exec();
                materials.forEach(async material => {
                    const locationType = material.in_Location.type;
                    const feature = material.material.feature;
                    const materialId = material.material._id.toString();
                    const materialInstock = await MaterialUsage.findOne({ material: materialId, status: "នៅក្នុងឃ្លាំង" }).exec();
                    const QtyOldStock = materialInstock?.qty;
                    const QtyNew = material.qty;

                    if (locationType === "ការិយាល័យ" && feature === "រយៈពេលវែង" && materialInstock) {

                        await MaterialUsage.findOneAndUpdate({ material: materialId }, { qty: QtyOldStock + QtyNew }).exec();

                    } else if (locationType === "ការិយាល័យ" && feature === "រយៈពេលវែង" && !materialInstock) {
                        await MaterialUsage.findOneAndUpdate({ material: materialId }, { status: "នៅក្នុងឃ្លាំង" }).exec();
                    } else if (locationType === "ទំនិញ" && materialInstock) {
                        await MaterialUsage.findOneAndUpdate({ material: materialId }, { qty: QtyOldStock + QtyNew }).exec();
                    } else if (locationType === "ទំនិញ" && !materialInstock) {
                        await MaterialUsage.findOneAndUpdate({ material: materialId }, { status: "នៅក្នុងឃ្លាំង" }).exec();
                    } else {
                        console.log("No Material update")
                    }
                    // ការិយាល័យ
                    // console.log(locationType)
                })
                const updateRewuestion = await Requestion.findByIdAndUpdate(args.requestion_Id, { status: "នៅក្នុងឃ្លាំង" }).exec();
                if (updateRewuestion)
                    return {
                        message: "​សម្ភារៈត្រូវបានដាក់ចូលក្នុងឃ្លាំង",
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