const ReleaseMaterial = require('../models/ReleaseMaterail');
const MaterialUsage = require('../models/MaterialUsage');
const Material = require('../models/Material');
const Location = require('../models/Location');
const { Requestion_Number_Generator } = require('../../util/fn');
const { authCheck } = require('../../helpers/auth');
const mongoose = require('mongoose');
// const moment = require('moment-timezone');
const releaseCardLabels = {
    docs: "data",
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
        getReleaseMaterialPagination: async (__, args) => {
            // console.log(args.order_Date)
            let query = []
            var date = new Date(args.order_Date); // M-D-YYYY
            var m = date.getMonth() + 1;
            var y = date.getFullYear();
            var d = date.getDate();
            var lestDay = parseInt(d) - 1;
            var gandDay = parseInt(d) + 1;
            var dateLess = y + '-' + (m <= 9 ? '0' + m : m) + '-' + (lestDay <= 9 ? '0' + lestDay : lestDay);
            var dateBig = y + '-' + (m <= 9 ? '0' + m : m) + '-' + (gandDay <= 9 ? '0' + gandDay : gandDay);

            const options = {
                page: args.page || 1,
                limit: args.limit || 10,
                customLabels: releaseCardLabels,
                sort: {
                    created_At: -1,
                },
                populate: "delivery_man customer_Id stock_Controller_Id items.materrail_Id items.from_Stock_Id",
            }


            if (args.customer_Id && args.stock_Controller_Id === "" && args.order_Date === "") {
                query.push({
                    $and: [
                        { customer_Id: mongoose.Types.ObjectId(args.customer_Id) }
                    ],
                })
            } else if (args.customer_Id === "" && args.stock_Controller_Id && args.order_Date === "") {
                query.push({
                    $and: [
                        { stock_Controller_Id: mongoose.Types.ObjectId(args.stock_Controller_Id) }
                    ],
                })
            } else if (args.customer_Id === "" && args.stock_Controller_Id === "" && args.order_Date) {
                query.push({
                    $and: [
                        { order_Date: { $gte: dateLess, $lte: dateBig } }
                    ],
                })
            } else if (args.customer_Id && args.stock_Controller_Id && args.order_Date) {
                query.push({
                    $and: [
                        { customer_Id: mongoose.Types.ObjectId(args.customer_Id) },
                        { stock_Controller_Id: mongoose.Types.ObjectId(args.stock_Controller_Id) },
                        { order_Date: { $gte: dateLess, $lte: dateBig } }
                    ],
                })
            } else if (args.customer_Id && args.stock_Controller_Id && args.order_Date === "") {
                query.push({
                    $and: [
                        { customer_Id: mongoose.Types.ObjectId(args.customer_Id) },
                        { stock_Controller_Id: mongoose.Types.ObjectId(args.stock_Controller_Id) },
                    ],
                })
            } else if (args.customer_Id && args.stock_Controller_Id === "" && args.order_Date) {
                query.push({
                    $and: [
                        { customer_Id: mongoose.Types.ObjectId(args.customer_Id) },
                        { order_Date: { $gte: dateLess, $lte: dateBig } }
                    ],
                })
            } else if (args.customer_Id === "" && args.stock_Controller_Id && args.order_Date) {
                query.push({
                    $and: [
                        { stock_Controller_Id: mongoose.Types.ObjectId(args.stock_Controller_Id) },
                        { order_Date: { $gte: dateLess, $lte: dateBig } }
                    ],
                })
            }


            const releaseCard = await ReleaseMaterial.paginate(query[0], options);
            return releaseCard;
        },
        getRelaseCardByDate: async (__, args) => {
            // console.log(getTime.getDate())

            var date = new Date(args.delivery_Date); // M-D-YYYY
            var m = date.getMonth() + 1;
            var y = date.getFullYear();
            var d = date.getDate();
            var lestDay = parseInt(d) - 1;
            var gandDay = parseInt(d) + 1;
            var dateLess = y + '-' + (m <= 9 ? '0' + m : m) + '-' + (lestDay <= 9 ? '0' + lestDay : lestDay);
            var dateBig = y + '-' + (m <= 9 ? '0' + m : m) + '-' + (gandDay <= 9 ? '0' + gandDay : gandDay);
            // console.log("s" + dateBig)
            const getRelaseCards = await ReleaseMaterial.find(
                {
                    delivery_Date: { $gte: dateLess, $lte: dateBig }
                }
            ).limit(6).exec();
            return {
                message: "Get Release Card Success!",
                status: true,
                data: getRelaseCards
            }
        }
    },
    Mutation: {
        createReleasMaterialCard: async (__, args, { req }) => {
            const currentUser = await authCheck(req);

            try {
                // var date = new Date(args.input.order_Date); // M-D-YYYY

                // var d = date.getDate();
                // var m = date.getMonth() + 1;
                // var y = date.getFullYear();

                // var dateString = y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
                // console.log(args)
                let Message = []
                const items = args.input.items

                const getlength = await ReleaseMaterial.find().exec();
                const number = await Requestion_Number_Generator(getlength.length);

                const checkUpdateQty = await items.map(async element => {

                    const getLocation = await Location.findById(element.from_Stock_Id).exec();
                    const getRawMaterail = await Material.findById(element.materrail_Id).exec();

                    const getMaterial = await MaterialUsage.findOne({
                        material: element.materrail_Id,
                        in_Location: element.from_Stock_Id
                    }).populate("in_Location material");

                    const getCheckMaterial = await MaterialUsage.findOne({
                        status: "បានទទួល",
                        material: element.materrail_Id,
                        in_Location: element.from_Stock_Id
                    }).populate("in_Location material");
                    // console.log(element)
                    if (getMaterial === null) {
                        // console.log("ss")
                        Message.push(`${getRawMaterail.name}មិនមានក្នុង${getLocation.name}`)
                        return false
                    }
                    if (getCheckMaterial === null) {
                        Message.push(`${getMaterial.material.name} មិនមានក្នុង${getMaterial.in_Location.name}!`)
                        return false
                    }
                    if (element.qty > getCheckMaterial.qty) {
                        Message.push(`${getCheckMaterial.material.name}ក្នុង${getMaterial.in_Location.name} មិនមានគ្រប់ចំនួន!`)
                        return false
                    }
                    if (getCheckMaterial != null && element.qty < getCheckMaterial.qty)
                        return true

                })

                const pp = await Promise.all(checkUpdateQty);
                const result = pp.filter(p => p === false);
                // console.log(checkUpdateQty)
                if (result.length) {
                    return {
                        status: false,
                        message: Message[0]
                    }
                } else {

                    items.map(async item => {

                        const getCheckMaterial = await MaterialUsage.findOne({
                            status: "បានទទួល",
                            material: item.materrail_Id,
                            in_Location: item.from_Stock_Id
                        }).populate("in_Location material");

                        await MaterialUsage.findOneAndUpdate(
                            {
                                status: "បានទទួល",
                                material: item.materrail_Id,
                                in_Location: item.from_Stock_Id
                            },
                            {
                                qty: getCheckMaterial.qty - item.qty
                            }
                        )

                    })
                    const creatCard = await new ReleaseMaterial({
                        ...args.input,
                        no: number,
                        stock_Controller_Id: mongoose.Types.ObjectId(currentUser.uid)
                    }).save();
                    if (creatCard)
                        return {
                            status: true,
                            message: "បង្កើតប័ណ្ដចេញទំនិញជោគជ័យ!"
                        }
                }

            } catch (error) {
                return {
                    status: false,
                    message: error.message
                }
            }
        },
        voidReleasMaterialCard: async (__, args) => {
            try {
                await ReleaseMaterial.findByIdAndUpdate(
                    args.releas_Card_Id,
                    {
                        status: true
                    }
                ).exec();
                const getRes = await ReleaseMaterial.findById(args.releas_Card_Id).exec();
                // console.log(getRes.status)
                if (getRes.status)
                    // await ReleaseMaterial.
                    // console.log(getRes.items)
                    getRes.items.map(async item => {
                        const MaterialinStock = await MaterialUsage.findOne({
                            status: "បានទទួល",
                            material: item.materrail_Id,
                            in_Location: item.from_Stock_Id
                        }).exec()

                        await MaterialUsage.findOneAndUpdate(
                            {
                                status: "បានទទួល",
                                material: item.materrail_Id,
                                in_Location: item.from_Stock_Id
                            },
                            {
                                qty: MaterialinStock.qty + item.qty
                            }
                        ).exec();

                    })
                return {
                    message: "ប័ណ្ណចេញទំនិញចាត់ទុកជាមោឃៈ!",
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