const mongoose = require('mongoose');
const Paginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const materialUsage = new mongoose.Schema({
    status: { type: String, default: 'រងចាំ' },
    material_Name: String,
    material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
    request: { type: mongoose.Schema.Types.ObjectId, ref: 'Requestion' },
    expired_Date: Date,
    qty: Number,
    unit_Price: Number,
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    supplier_Name: String,
    in_Location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    location_Name: String,
    date: Date,
    key: Date
})

materialUsage.plugin(aggregatePaginate);
const model = mongoose.model('MaterialUsage', materialUsage);
module.exports = model;