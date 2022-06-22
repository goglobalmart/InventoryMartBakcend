const Supplier = require('../models/Supplier');
const Requestion = require('../models/Requestion');

const supplierLabels = {
    docs: "suppliers",
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
        getSupplierbyId: async (__, args) => {
            try {
                const getSupplier = await Supplier.findById(args.supplier_id).exec();
                if (getSupplier)
                    return {
                        message: "Get Supplier Success!",
                        data: getSupplier,
                        status: true
                    }
                if (!getSupplier)
                    return {
                        message: "Cannot find supplier!",
                        data: null,
                        status: false
                    }
            } catch (error) {
                return {
                    message: error.message,
                    data: null,
                    status: false
                }
            }
        },
        getSupplierWithPaginatioin: async (__, args) => {
            const options = {
                page: args.page || 1,
                limit: args.limit || 10,
                customLabels: supplierLabels,
                sort: {
                    createdAt: -1,
                },
            }
            const query = {
                $or: [
                    { name: { $regex: args.keyword, $options: "i" } },
                ],
            }
            const suppliers = await Supplier.paginate(query, options);

            return suppliers;
        }
    },
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
        },
        updateSupplier: async (__, args) => {
            try {
                const findUpdate = await Supplier.findByIdAndUpdate(args.input._id, args.input).exec();
                if (findUpdate)
                    return {
                        message: "Supplier Updated",
                        status: true
                    }
            } catch (error) {
                return {
                    message: error.message,
                    status: false
                }
            }
        },
        deleteSupplier: async (__, args) => {
            try {
                const getUsing = await Requestion.find(
                    { "materials.supplier": args.supplier_id },
                ).exec();
                console.log(getUsing.length)
                if (getUsing.length > 0)
                    return {
                        message: "អ្នកផ្គត់ផ្គងត្រូវបានប្រើប្រាស់​ មិនអាចលុបបានទេ!",
                        status: false
                    }
                const findDelete = await Supplier.findByIdAndDelete(args.supplier_id).exec();
                if (findDelete) {
                    return {
                        message: "Supplier Deleted!",
                        status: true
                    }
                } else {
                    return {
                        message: "Supplier Has Been Delete!",
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