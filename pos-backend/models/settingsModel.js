const mongoose = require("mongoose");
const tenantIsolation = require("./plugins/tenantIsolation");

const settingsSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
        unique: true
    },
    restaurantName: {
        type: String,
        required: true,
        default: "Restro"
    },
    location: {
        type: String,
        default: ""
    },
    branch: {
        type: String,
        default: "Main Branch"
    },
    contactNumber: {
        type: String,
        default: ""
    },
    logoUrl: {
        type: String,
        default: ""
    },
    enableCash: {
        type: Boolean,
        default: true
    },
    enableCard: {
        type: Boolean,
        default: true
    },
    enableOnline: {
        type: Boolean,
        default: true
    },
    enableTaxes: {
        type: Boolean,
        default: true
    },
    enableTakeaway: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

settingsSchema.plugin(tenantIsolation);

module.exports = mongoose.model("Settings", settingsSchema);
