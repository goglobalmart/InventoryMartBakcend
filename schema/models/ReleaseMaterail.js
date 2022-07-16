const mongoose = require('mongoose');
const Paginate = require('mongoose-paginate-v2');

const releaseMaterail = new mongoose.Schema({
    no: String,
    delivery_Date: Date,
    created_At: { type: Date, default: new Date().toISOString() },
    order_Date: Date,
    customer_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    stock_Controller_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    delivery_man: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: Boolean, default: false },
    items: [
        {
            materrail_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
            from_Stock_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
            qty: Number,
            other: String,
            key: Date
        }
    ]
})

releaseMaterail.plugin(Paginate);
const model = mongoose.model('ReleaseMaterail', releaseMaterail);
module.exports = model;