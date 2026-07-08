const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
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

module.exports = mongoose.model("Category", categorySchema);
