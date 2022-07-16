const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Paginate = require('mongoose-paginate-v2');
const material = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    price: Number,
    category: String,
    image_src: String,
    remark: String,
    type: String,
    feature: String,
    unit: String,
    created_At: { type: Date, default: new Date().toISOString() }
})
material.plugin(uniqueValidator);
material.plugin(Paginate);
const model = mongoose.model('Material', material);
module.exports = model;