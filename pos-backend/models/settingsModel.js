const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Settings", settingsSchema);
