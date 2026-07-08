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
    }
}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);
