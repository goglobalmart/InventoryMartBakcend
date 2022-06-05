const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const material = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    price: Number,
    category: String,
    image_src: String,
    remark: String,
})
material.plugin(uniqueValidator);
const model = mongoose.model('Material', material);
module.exports = model;