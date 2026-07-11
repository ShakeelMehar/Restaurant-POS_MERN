const mongoose = require("mongoose");
const tenantIsolation = require("./plugins/tenantIsolation");

const tableSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
        index: true
    },
    tableNo: { type: Number, required: true },
    status: {
        type: String,
        default: "Available"
    },
    seats: { 
        type: Number,
        required: true
    },
    currentOrder: {type: mongoose.Schema.Types.ObjectId, ref: "Order"}
});

tableSchema.index({ restaurantId: 1, tableNo: 1 }, { unique: true });

tableSchema.plugin(tenantIsolation);

module.exports = mongoose.model("Table", tableSchema);