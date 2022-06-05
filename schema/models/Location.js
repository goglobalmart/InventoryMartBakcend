const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const location = new mongoose.Schema({
    name:  {
        type: String,
        unique: true
    },
    create_At: { type: Date, default: new Date().toISOString() },
    remark: String,
    materials: [{
        material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
        date: Date,
        expired_Date: Date,
        qty: Number,
        supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }
    }]
  
})

location.plugin(uniqueValidator);
const model = mongoose.model('Location', location);
module.exports = model;