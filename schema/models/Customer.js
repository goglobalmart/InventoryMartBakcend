const mongoose = require('mongoose');

const customer = new mongoose.Schema({
    name: String,
    tel: String,
    email: String,
    address: String,
    remark: String,
    created_At: { type: Date, default: new Date().toISOString() }
})

const model = mongoose.model("Customer", customer);
module.exports = model;