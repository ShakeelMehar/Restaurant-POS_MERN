const mongoose = require("mongoose");
const tenantIsolation = require("./plugins/tenantIsolation");

const orderSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
        index: true
    },
    customerDetails: {
        name: { type: String, default: "Customer" },
        phone: { type: String, default: "" },
        guests: { type: Number, default: 1 },
    },
    orderStatus: {
        type: String,
        required: true
    },
    orderType: {
        type: String,
        required: true,
        default: "Dine In"
    },
    orderDate: {
        type: Date,
        default : Date.now
    },
    bills: {
        total: { type: Number, required: true },
        tax: { type: Number, required: true },
        totalWithTax: { type: Number, required: true }
    },
    items: [],
    cashier: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentMethod: String,
    paymentData: {
        razorpay_order_id: String,
        razorpay_payment_id: String
    }
}, { timestamps : true } );

orderSchema.index({ restaurantId: 1, createdAt: -1 });

orderSchema.plugin(tenantIsolation);

module.exports = mongoose.model("Order", orderSchema);