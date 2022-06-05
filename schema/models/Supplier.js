const mongoose = require('mongoose');

const supplier = new mongoose.Schema({
    name: String,
    phone_Number: String,
    email: String,
    location: String,
    create_At: { type: Date, default: new Date().toISOString() }
})

const model = mongoose.model("Supplier", supplier);
module.exports = model