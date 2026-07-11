const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        default: "",
    },
    phone: {
        type: String,
        default: "",
    },
    taxId: {
        type: String,
        default: "",
    },
    logo: {
        type: String,
        default: "",
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Restaurant", restaurantSchema);
