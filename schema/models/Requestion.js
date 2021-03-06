const mongoose = require('mongoose');
const Paginate = require('mongoose-paginate-v2');

const requestion = new mongoose.Schema({
    type: String,
    need_Date: Date,
    no: String,
    for_Location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    reqeustion_By: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approve_By: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receive_By: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    priority: String,
    status: { type: String, default: "រងចាំ" },
    // materials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MaterialUsage' }],
    remark: String,
    created_At: { type: Date, default: new Date().toISOString() }
})
requestion.plugin(Paginate);
const model = mongoose.model("Requestion", requestion);
module.exports = model;
