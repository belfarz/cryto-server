const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: String,
    phone: String,
    orders:[
        {
            description: String,
            amount: Number
        }
    ]
});

module.exports = mongoose.model("staff",customerSchema);