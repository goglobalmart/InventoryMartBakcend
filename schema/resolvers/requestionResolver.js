const Requestion = require('../models/Requestion');
const { Requestion_Number_Generator } = require('../../util/fn');
const { authCheck } = require('../../helpers/auth');
// const User = require('../models/User');
// const Location = require('../models/Location');
const MaterialUsage = require('../models/MaterialUsage');
const { default: mongoose } = require('mongoose');

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
                    created_At: -1,
                },
                populate: "reqeustion_By for_Location approve_By",
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
            // console.log(requestions)
            return requestions;
        }
    },
    Mutation: {
        createRequestion: async (__, args) => {
            let newArray = [];
            try {
                const getlength = await Requestion.find().exec();
                const number = await Requestion_Number_Generator(getlength.length);
                // console.log(args.input)

                const requestion = await new Requestion({
                    ...args.input,
                    no: number
                }).save();
                console.log(requestion && args.input.type === `????????????????????????`)
                if (requestion && args.input.type === `????????????????????????`) {
                    args.input.materials.forEach(element => {
                        const finalResult = Object.assign(element, { request: requestion._id });
                        newArray.push(finalResult);
                    });
                    console.log(newArray)
                    await MaterialUsage.insertMany(newArray)
                    return {
                        message: `?????????????????????????????????${args.input.type} ??????????????????!`,
                        status: true
                    }
                } else {
                    args.input.materials.forEach(element => {
                        const finalResult = Object.assign(element, { request: requestion._id });
                        newArray.push(finalResult);
                    });
                    await MaterialUsage.insertMany({
                        ...newArray,
                        supplier: new mongoose.Types.ObjectId()
                    })
                    // console.log(newArray)
                    return {
                        message: `?????????????????????????????????${args.input.type} ??????????????????!`,
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
        deleteRequestion: async (__, args) => {
            try {
                const checkStatus = await Requestion.findById(args.requestion_Id).exec();
                if (!checkStatus)
                    return {
                        message: "Cannot find Requestion to delete!",
                        status: false
                    }
                if (checkStatus.status != "???????????????")
                    return {
                        message: `???????????????????????????????????? ${checkStatus.status}??? ???????????????????????????!`,
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
                        message: "??????????????????????????????!",
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
            let newArray = [];
            try {
                const findRequestion = await Requestion.findById(args.input._id).exec();
                // if (findRequestion.status != "???????????????" || findRequestion.status != "????????????????????????")
                //     return {
                //         message: `??????????????????????????????????????????????????? ${findRequestion.status} ?????????????????????????????????????????????!`,
                //         status: false
                //     }
                await Requestion.findByIdAndUpdate(args.input._id, args.input).exec();

                // delete Old manterail 
                await MaterialUsage.deleteMany({
                    request: args.input._id
                }).then(function () {
                    console.log("Data deleted"); // Su ccess
                }).catch(function (error) {
                    console.log(error); // Failure
                });

                // add new material 
                args.input.materials.forEach(element => {
                    const finalResult = Object.assign(element, { request: args.input._id });
                    newArray.push(finalResult);
                });
                await MaterialUsage.insertMany(newArray)

                return {
                    message: `??????????????????????????????????????????????????????????????????!`,
                    status: true
                }
            } catch (error) {
                return {
                    message: error.message,
                    status: false
                }
            }
        },
        approveRequestion: async (__, args, { req }) => {
            const currentUser = await authCheck(req)
            try {
                const getRequestion = await Requestion.findByIdAndUpdate(args.requestion_Id, { status: args.status, approve_By: currentUser.uid });
                if (getRequestion)
                    return {
                        message: `?????????????????????????????????????????? ${args.status}`,
                        status: true
                    }
            } catch (error) {
                return {
                    message: error.message,
                    status: false
                }
            }
        },
        receiveMaterial: async (__, args, { req }) => {
            try {
                const reqeustion = await Requestion.findById(args.requestion_Id).exec();

                if (!reqeustion)
                    return {
                        message: '???????????????????????????????????????',
                        status: false
                    }

                const materials = await MaterialUsage.find({ request: reqeustion._id.toString() }).populate('material').populate('in_Location').exec();
                materials.forEach(async material => {
                    const locationType = material?.in_Location?.type;
                    const feature = material.material.feature;
                    const materialId = material.material._id.toString();
                    const materialInstock = await MaterialUsage.findOne({ material: materialId, status: "?????????????????????" }).exec();
                    const QtyOldStock = materialInstock?.qty;
                    const QtyNew = material.qty;

                    if (locationType === "???????????????????????????" && feature === "???????????????????????????" && materialInstock) {

                        await MaterialUsage.findOneAndUpdate({ material: materialId }, { qty: QtyOldStock + QtyNew }).exec();

                    } else if (locationType === "???????????????????????????" && feature === "???????????????????????????" && !materialInstock) {
                        await MaterialUsage.findOneAndUpdate({ material: materialId }, { status: "?????????????????????" }).exec();
                    } else if (locationType === "???????????????" && materialInstock) {
                        await MaterialUsage.findOneAndUpdate({ material: materialId }, { qty: QtyOldStock + QtyNew }).exec();
                    } else if (locationType === "???????????????" && !materialInstock) {
                        await MaterialUsage.findOneAndUpdate({ material: materialId }, { status: "?????????????????????" }).exec();
                    } else {
                        console.log("No Material update")
                    }
                    // ???????????????????????????
                    // console.log(locationType)
                })
                const updateRewuestion = await Requestion.findByIdAndUpdate(args.requestion_Id, { status: "?????????????????????", }).exec();
                if (updateRewuestion)
                    return {
                        message: "??????????????????????????????????????????????????????????????????????????????????????????????????????",
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