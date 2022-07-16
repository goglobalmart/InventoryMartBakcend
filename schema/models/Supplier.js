const mongoose = require('mongoose');
const Paginate = require('mongoose-paginate-v2');

const supplier = new mongoose.Schema({
    name: String,
    phone_Number: String,
    email: String,
    location: String,
    created_At: { type: Date, default: new Date().toISOString() }
})

supplier.plugin(Paginate);
const model = mongoose.model("Supplier", supplier);
module.exports = model