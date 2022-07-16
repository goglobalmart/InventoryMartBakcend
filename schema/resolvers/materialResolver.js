const Material = require('../models/Material');
// const Requestion = require('../models/Requestion');
const MaterialUsage = require('../models/MaterialUsage');
const Supplier = require('../models/Supplier');
const Location = require('../models/Location');
const { default: mongoose } = require('mongoose');
const materialLabels = {
    docs: "materials",
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
        getMaterialwithPagination: async (__, args) => {
            // page: Int!,limit: Int!,keyword: String!, type: String!, category: String!
            const options = {
                page: args.page || 1,
                limit: args.limit || 1,
                customLabels: materialLabels,
                sort: {
                    createdAt: -1,
                },
            }
            const query = {
                $and: [
                    { name: { $regex: args.keyword, $options: "i" } },
                    { type: { $regex: args.type, $options: "i" } },
                    { category: { $regex: args.category, $options: "i" } }
                ]
            };
            const materials = await Material.paginate(query, options);
            return materials;
        },
        getMaterials: async (__, args) => {
            try {
                const materials = await Material.find().exec();
                if (materials) {
                    return {
                        message: "Get material success!",
                        status: true,
                        data: materials
                    }
                } else {
                    return {
                        message: "Cannot get  material!",
                        status: false,
                        data: null
                    }
                }

            } catch (error) {
                return {
                    message: error.message,
                    status: false,
                    data: null
                }
            }
        },
        getMaterialUsagewithPagination: async (__, args,) => {
            // console.log(args)
            //    keyword: String!,location: String type: String!, category: String!

            let queryType = {}
            let queryCategory = {}
            let queryInLocation = {}

            if (args.type !== "") {
                queryType = { 'material.type': args.type }
            }
            if (args.category !== "") {
                queryCategory = { 'material.category': args.category }
            }
            if (args.location !== "") {
                queryInLocation = { 'in_Location': mongoose.Types.ObjectId(args.location) }
            }

            const options = {
                page: args.page || 1,
                limit: args.limit || 1,
                customLabels: materialLabels,
                sort: {
                    createdAt: -1,
                },
            }
            const myAggregate = MaterialUsage.aggregate(
                [
                    {
                        $lookup: {
                            'from': 'materials',
                            'localField': 'material',
                            'foreignField': '_id',
                            'as': 'material'
                        }
                    },
                    {
                        $unwind: '$material'
                    },

                    {
                        '$match': { $and: [queryType, queryCategory, queryInLocation, { status: 'បានទទួល', "qty": { $gte: 1 } }] }
                    }
                ]
            )

            const materials = await MaterialUsage.aggregatePaginate(myAggregate, options);

            await Supplier.populate(materials, { path: 'materials.supplier' })
            await Location.populate(materials, { path: 'materials.in_Location' })

            return materials;
        },
        getMaterialUsagebyRequestion: async (__, args) => {
            try {
                const materials = await MaterialUsage.find(
                    {
                        request: args.requestion_Id
                    }
                ).populate('request in_Location supplier material').exec();
                if (materials) {
                    return {
                        message: "Get Materails Success!",
                        status: true,
                        data: materials
                    }
                } else {
                    return {
                        message: "cannot Get Materails!",
                        status: false,
                        data: null
                    }
                }
            } catch (error) {
                return {
                    message: error.message,
                    status: false,
                    data: null
                }
            }
        },
        getLessMaterialUsagebyLocation: async (__, args) => {
            try {
                const getLessMaterials = await MaterialUsage.find(
                    {
                        in_Location: mongoose.Types.ObjectId(args.location_Id),
                        status: "បានទទួល"
                    }
                ).sort({ qty: 1 }).limit(4).populate("material in_Location").exec();

                return {
                    message: "Get Material Success!",
                    data: getLessMaterials,
                    status: true
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
        createMaterial: async (__, args) => {
            try {
                const material = await new Material(args.input).save();
                // console.log(material)
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
        },
        updateMaterial: async (__, args) => {

            try {
                const findDouplicate = await Material.find({ name: args.input.name, _id: { $ne: args.input.material_Id } }).exec();
                if (findDouplicate.length != 0)
                    return {
                        message: "The Name is Already Used!",
                        status: false
                    }
                const FindMaterail = await Material.findById(args.input.material_Id).exec();

                if (FindMaterail.name === args.input.name) {
                    await Material.findByIdAndUpdate(
                        args.input.material_Id, {
                        price: args.input.price,
                        category: args.input.category,
                        image_src: args.input.image_src,
                        remark: args.input.remark,
                        type: args.input.type,
                        feature: args.input.feature,
                        unit: args.input.unit
                    }).exec();
                } else {
                    await Material.findByIdAndUpdate(args.input.material_Id, args.input).exec();
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
        deleteMaterial: async (__, args) => {
            try {

                const getUsing = await MaterialUsage.find(
                    { "material": args.material_Id },
                ).exec();
                if (getUsing.length > 0)
                    return {
                        message: "សម្ភារៈនេះត្រូវបានប្រើប្រាស់​ មិនអាចលុបបានទេ!",
                        status: false
                    }

                const findDelete = await Material.findByIdAndDelete(args.material_Id).exec();

                if (findDelete) {
                    return {
                        message: "លុបជោគជ័យ!",
                        status: true
                    }
                } else {
                    return {
                        message: "ស្វែងរកទិន្នន័យមិនឃើញ!",
                        status: false
                    }
                }
            } catch (error) {
                return {
                    message: error.message,
                    status: false
                }
            }
        },
        moveMaterialLocation: async (__, args) => {
            // (material_Id: String!, in_Location_Id: String!, moving_Location_Id: String!, qty: Float!)
            try {
                const getCurrentMaterialQty = await MaterialUsage.findById(args.material_Id).exec();
                if (!getCurrentMaterialQty)
                    return {
                        message: "រកសម្ភារៈដែលត្រូវប្ដូរទីតាំងមិនឃើញ",
                        status: false
                    }
                const currentQty = getCurrentMaterialQty.qty;

                if (args.qty > currentQty) {
                    return {
                        message: `សម្ភារៈមិនមានគ្រប់ចំនួន!`,
                        status: false
                    }
                } else {

                    // update new Stock 
                    // fine materil in new stock 
                    const getMaterailInStock = await MaterialUsage.findOne(
                        {
                            material: mongoose.Types.ObjectId(getCurrentMaterialQty.material),
                            in_Location: mongoose.Types.ObjectId(args.moving_Location_Id),
                            status: "បានទទួល"
                        }
                    ).exec();

                    // await MaterialUsage.findOneAndUpdate(
                    //     {
                    //         in_Location: mongoose.Types.ObjectId(args.moving_Location_Id),

                    //     }
                    // ).exec()

                    // cut stock 
                    // await MaterialUsage.findByIdAndUpdate(
                    //     args.material_Id,
                    //     {
                    //         qty: currentQty - args.qty
                    //     }
                    // ).exec();

                    // return {
                    //     message: "ប្តូរទិតាំងជោគជ័យ!",
                    //     status: false
                    // }
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