const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    coinId: {
        type: String,
        required: true
    }, 
    address: {
        type: String,
        required: true
    },
    chain: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("promote",customerSchema);