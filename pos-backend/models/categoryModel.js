const mongoose = require("mongoose");
const tenantIsolation = require("./plugins/tenantIsolation");

const categorySchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    bgColor: {
        type: String,
        default: "#5b45b0"
    },
    icon: {
        type: String,
        default: "+"
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Ensure category names are unique per restaurant
categorySchema.index({ restaurantId: 1, name: 1 }, { unique: true });

categorySchema.plugin(tenantIsolation);

module.exports = mongoose.model("Category", categorySchema);
